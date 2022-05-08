import Manager from './Manager'
import Resources from './Resources'

export default class Transformer {
  public _data: any
  public _dataType: string
  public _transformer: any
  public _variant: null
  public _pagination: null
  public _context: null
  public _manager: any
  public _meta: any
  public _ctx: any

  public static create (data = null, transformer = null) {
    // create an instance of src and pass a new instance of Manager
    const instance = new Transformer(new Manager())

    // initialize data and transformer properties
    instance._data = data
    instance._dataType = instance._determineDataType(data)
    instance._transformer = transformer
    instance._variant = null

    // set pagination, context and meta properties to null
    instance._pagination = null
    instance._context = null
    instance._meta = null

    // return the instance for the fluid interface
    return instance
  }

  constructor (manager) {
    this._manager = manager
    return this
  }

  public collection (data, transformer = null) {
    this._setData('Collection', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toJSON()
    }

    return this
  }

  public item (data, transformer = null) {
    this._setData('Item', data)

    if (transformer) {
      this.transformWith(transformer)
      return this.toJSON()
    }

    return this
  }

  public null () {
    this._setData('Null', null)

    return this
  }

  public paginate (data, transformer = null) {
    this._setData('Collection', data.rows)

    // set pagination data
    this._pagination = data.getMeta()

    if (transformer) {
      this.transformWith(transformer)
      return this.toJSON()
    }

    return this
  }

  public meta (meta) {
    this._meta = meta

    return this
  }

  public transformWith (transformer) {
    this._transformer = transformer

    return this
  }

  public usingVariant (variant) {
    this._variant = variant

    return this
  }

  public withContext (ctx) {
    this._ctx = ctx

    return this
  }

  public include (include) {
    this._manager.parseIncludes(include)

    return this
  }

  public setSerializer (serializer) {
    this._manager.setSerializer(serializer)

    return this
  }

  public serializeWith (serializer) {
    return this.setSerializer(serializer)
  }

  public toArray () {
    console.warn('Deprecation warning: Calling #toArray() is deprecated. Please us #toJSON() instead.')
    return this.toJSON()
  }

  public toJSON () {
    return this._createData().toJSON()
  }

  public _setData (dataType, data) {
    this._data = data
    this._dataType = dataType
    this._pagination = null

    return this
  }

  public _createData () {
    return this._manager.createData(this._getResource(), this._ctx)
  }

  public _getResource () {
    const Resource = Resources[this._dataType]
    const resourceInstance = new Resource(this._data, this._transformer)

    resourceInstance.setMeta(this._meta)
    resourceInstance.setPagination(this._pagination)
    resourceInstance.setVariant(this._variant)

    return resourceInstance
  }

  public _determineDataType (data) {
    if (data === null) {
      return 'Null'
    }

    if (Array.isArray(data)) {
      return 'Collection'
    }

    return 'Item'
  }
}
