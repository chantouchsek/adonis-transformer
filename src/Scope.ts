// import { Ioc } from '@adonisjs/fold'
import _trimEnd from 'lodash/trimEnd'

import TransformerAbstract from './TransformerAbstract'
import Resources from './Resources'

export default class Scope {
  public _manager: any
  public _resource: any
  public _ctx: any
  public _scopeIdentifier: any
  public _parentScopes: any[]

  constructor (manager, resource, ctx, scopeIdentifier = null) {
    this._manager = manager
    this._resource = resource
    this._ctx = ctx
    this._scopeIdentifier = scopeIdentifier
    this._parentScopes = []
  }

  public async toJSON () {
    // run the transformation on the data
    const [rawData] = await this._executeResourceTransformers()

    // create a serializer instance
    const serializer = this._manager.getSerializer()

    // run the raw data through the serializer
    let data = await this._serializeResource(serializer, rawData)

    // initialize an empty meta object
    let meta = {}

    // if the resource is a collection and there is pagination data...
    if (this._resource instanceof Resources.Collection && this._resource.getPagination()) {
      // run the pagination data through the serializer and add it to the meta object
      const pagination = await serializer.paginator(this._resource.getPagination())
      meta = Object.assign(pagination, meta)
    }

    // if there is custom meta data, add it the our meta object
    if (this._resource.getMeta()) {
      meta = await serializer.meta(this._resource.getMeta())
    }

    // If any meta data has been added, add it to the response
    if (Object.keys(meta).length !== 0) {
      // If the serializer does not support meta data,
      // we just force the data object under a 'data' property since we can not mix an array with objects
      if (Array.isArray(data) || (typeof data !== 'object' && data !== null)) {
        data = { data: data }
      }

      // merge data with meta data
      data = Object.assign(meta, data)
    }

    // all done, return the transformed data
    return data
  }

  public async _executeResourceTransformers () {
    // get a transformer and fetch data from the resource
    const transformer = this._resource.getTransformer()
    const data = await this._resource.getData()

    let transformedData: any = []
    let includedData: any = []

    if (!data || this._resource instanceof Resources.Null) {
      // If the resource is a null-resource, set data to null without includes
      transformedData = null
      includedData = []
    } else if (this._resource instanceof Resources.Item) {
      // It the resource is an item, run the data through the transformer
      [transformedData, includedData] = await this._fireTransformer(data, transformer)
    } else if (this._resource instanceof Resources.Collection) {
      // It we have a collection, get each item from the array of data
      // and run each item individually through the transformer
      for (const value of data) {
        const [transformedValue, includedValue] = await this._fireTransformer(value, transformer)

        transformedData.push(transformedValue)
        includedData.push(includedValue)
      }
    } else {
      // If we are here, we have some unknown resource and can not transform it
      throw new Error('This resource type is not supported. Use Item or Collection')
    }

    return [transformedData, includedData]
  }

  public async _fireTransformer (data, transformer) {
    let includedData = []

    // get a transformer instance and tranform data
    const transformerInstance = this._getTransformerInstance(transformer)
    let transformedData = await this._dispatchToTransformerVariant(transformerInstance, await data, this._ctx)

    // if this transformer has includes defined,
    // figure out which includes should be run and run requested includes
    if (this._transformerHasIncludes(transformerInstance)) {
      includedData = await transformerInstance._processIncludedResources(this, await data)
      transformedData = await this._manager.getSerializer().mergeIncludes(transformedData, includedData)
    }

    return [transformedData, includedData]
  }

  public async _serializeResource (serializer, rawData) {
    const scopeDepth = this.getScopeArray().length

    if (this._resource instanceof Resources.Collection) {
      return serializer.collection(rawData, scopeDepth)
    }

    if (this._resource instanceof Resources.Item) {
      return serializer.item(rawData, scopeDepth)
    }

    return serializer.null(scopeDepth)
  }

  public _isRequested (checkScopeSegment) {
    // create the include string by combining current level with parent levels
    const scopeString = [...this.getScopeArray(), checkScopeSegment].join('.')

    // check if this include was requested. If the include does not occur in the
    // requested includes, we check again, for it may have been requested using
    // snake_case instead of camelCase
    return this._manager.getRequestedIncludes().has(scopeString) ||
      this._manager.getRequestedIncludes(true).has(scopeString)
  }

  public _getTransformerInstance (Transformer) {
    // if the transformer is a string, use the IoC to fetch the instance.
    if (typeof Transformer === 'string') {
      Transformer = this._resolveTransformer(Transformer)
    }

    // if the transformer is a class, create a new instance
    if (Transformer && Transformer.prototype instanceof TransformerAbstract) {
      return new Transformer()
    }

    if (typeof Transformer === 'function') {
      // if a closure was passed, we create an anonymous transformer class
      // with the passed closure as transform method
      class ClosureTransformer extends TransformerAbstract {
        public transform (data: any): object {
          return Transformer(data)
        }
      }
      (<any>ClosureTransformer).transform = Transformer

      return new ClosureTransformer()
    }

    throw new Error('A transformer must be a function or a class extending TransformerAbstract')
  }

  public _resolveTransformer (transformer) {
    let prefix = ''

    // if the provided transformer name does not start with the App namespace
    // we assume we need to add the prefix to the name
    if (!transformer.startsWith('App')) {
      // const Config = new Ioc().use('Adonis/Src/Config')
      // const namespace = _trimEnd(Config.get('bumblebee.namespace', 'App/Transformers'), '/')
      const namespace = _trimEnd('App/Transformers', '/')

      prefix = `${namespace}/`
    }

    // try to load the transformer using the ioc container
    return import(`${prefix}${transformer}`)
  }

  public async _dispatchToTransformerVariant (transformerInstance, data, ctx) {
    const variant = this._resource.getVariant()

    //  if a variant was defined, we construct the name for the transform mehod
    // otherwise, the default transformer method 'transform' is called
    const transformMethodName = variant
      ? `transform${variant.charAt(0).toUpperCase()}${variant.slice(1)}`
      : 'transform'

    // Since the user can pass anything as a variant name, we need to
    // validate that the transformer method exists.
    if (!(transformerInstance[transformMethodName] instanceof Function)) {
      throw new Error(`A transformer method '${transformMethodName}' could not be found in '${transformerInstance.constructor.name}'`)
    }

    // now we call the transformer method on the transformer and return the data
    return transformerInstance[transformMethodName](data, ctx || this._ctx)
  }

  public _transformerHasIncludes (Transformer) {
    const defaultInclude = Transformer.defaultInclude
    const availableInclude = Transformer.availableInclude

    return defaultInclude.length > 0 || availableInclude.length > 0
  }

  public setParentScopes (parentScopes) {
    this._parentScopes = parentScopes
  }

  public getParentScopes () {
    return this._parentScopes
  }

  public getScopeIdentifier () {
    return this._scopeIdentifier
  }

  public getScopeArray () {
    if (this._scopeIdentifier) {
      return [...this._parentScopes, this._scopeIdentifier]
    }

    return []
  }
}
