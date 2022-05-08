import SerializerAbstract from './SerializerAbstract'

export default class PlainSerializer extends SerializerAbstract {
  public async collection (data) {
    return data
  }

  public async item (data) {
    return data
  }

  public async null () {
    return null
  }

  public async meta (meta) {
    return { meta: meta }
  }

  public async paginator (pagination) {
    return { pagination: pagination }
  }
}
