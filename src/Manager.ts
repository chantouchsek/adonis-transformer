// import { Ioc } from '@adonisjs/fold'
import _camelCase from 'lodash/camelCase'
import Scope from './Scope'
import Serializers from './Serializers'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SerializerAbstract from './Serializers/SerializerAbstract'
import PlainSerializer from './Serializers/PlainSerializer'
// import { ConfigContract } from '@ioc:Adonis/Core/Config'

// const ioc = new Ioc()

export default class Manager {
  public serializer: SerializerAbstract
  public requestedIncludes: Set<any>
  public _recursionLimit: number

  constructor () {
    this.serializer = new PlainSerializer()
    this.requestedIncludes = new Set()
    this._recursionLimit = 10
  }

  public createData (resource, ctx = {}) {
    this._setIncludesFromRequest(ctx as HttpContextContract)
    return new Scope(this, resource, ctx as HttpContextContract)
  }

  public getRequestedIncludes (transformCamelCase = false) {
    if (!transformCamelCase) {
      return this.requestedIncludes
    }

    const includes = [...this.requestedIncludes]
      .map(i => i.split('.').map(_camelCase).join('.'))

    return new Set(includes)
  }

  public parseIncludes (includes: string | string[]) {
    this.requestedIncludes = new Set()

    // if a string is passed, split by comma and return an array
    if (typeof includes === 'string') {
      includes = includes.split(',')
    }

    // if it is not an array, we can not parse it at this point
    if (!Array.isArray(includes)) {
      throw Error(`The parseIncludes() method expects a string or an array. ${typeof includes} given`)
    }

    // sanitize the includes
    includes = includes.map(i => this._guardAgainstToDeepRecursion(i))

    // add all includes to the internal set
    includes.forEach(this.requestedIncludes.add, this.requestedIncludes)
    this._autoIncludeParents()
  }

  public setRecursionLimit (limit: number) {
    this._recursionLimit = limit

    return this
  }

  public setSerializer (serializer: SerializerAbstract | string) {
    if (typeof serializer === 'string') {
      serializer = new Serializers[serializer]()
    }

    this.serializer = serializer as SerializerAbstract
  }

  public getSerializer () {
    if (!this.serializer) {
      this.setSerializer('plain')
    }

    return this.serializer
  }

  public _guardAgainstToDeepRecursion (include: string) {
    return include.split('.').slice(0, this._recursionLimit).join('.')
  }

  public _autoIncludeParents () {
    const parsed: any[] = []

    // for each resource that is requested
    for (const include of this.requestedIncludes) {
      // we split it by '.' to get the recursions
      const nested = include.split('.')

      // Add the first level to the includes
      let part = nested.shift()
      parsed.push(part)

      // if there are more nesting levels,
      // add each level to the includes
      while (nested.length) {
        part += `.${nested.shift()}`
        parsed.push(part)
      }
    }

    // add all parsed includes to the set of requested includes
    parsed.forEach(this.requestedIncludes.add, this.requestedIncludes)
  }

  public _setIncludesFromRequest (ctx: HttpContextContract) {
    // const Config: ConfigContract = ioc.use('Adonis/Core/Config')
    //
    // // Only parse includes if enabled in config
    // if (!Config.get('bumblebee.parseRequest', false)) {
    //   return
    // }
    if (!ctx) {
      return
    }

    // get all get parameters from the request
    const params = (ctx.request && ctx.request.all()) || {}

    // if the 'include' parameter is set, pass it the the parse method
    if (params.include) {
      this.parseIncludes(params.include)
    }
  }
}
