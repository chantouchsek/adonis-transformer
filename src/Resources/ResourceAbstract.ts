export default class ResourceAbstract {
  public data: any
  public meta: null
  public transformer: any | string
  public variant: null | string
  public pagination: any

  constructor (data, trans) {
    this.data = data
    this.meta = null

    const { transformer, variant } = this._separateTransformerAndVariation(trans)

    this.transformer = transformer
    this.variant = variant
  }

  public async getData (): Promise<any> {
    // data can be a promise, so we wait until it resolves
    const data = await this.data

    // if data is a lucid collection, return just the array with the data
    if (data && data.rows) {
      return data.rows
    }

    // data is an item, so we return it as is
    return data
  }

  public getTransformer () {
    return this.transformer
  }

  public setMeta (meta) {
    this.meta = meta

    return this
  }

  public getMeta () {
    return this.meta
  }

  public setPagination (pagination) {
    this.pagination = pagination

    return this
  }

  public getPagination () {
    return this.pagination
  }

  public setVariant (variant) {
    if (variant) {
      this.variant = variant
    }

    return this
  }

  public getVariant () {
    return this.variant
  }

  public _separateTransformerAndVariation (transformerString) {
    // This feature is only available when a string binding is used
    if (typeof transformerString !== 'string') {
      return { transformer: transformerString, variant: null }
    }

    const regex = /(.*)\.(.*)/

    const matches = transformerString.match(regex)

    // if the string did not contain a variation use the
    // transformerString is used and the variation is set to null
    const transformer = matches ? matches[1] : transformerString
    const variant = matches ? matches[2] : null

    return { transformer, variant }
  }
}
