import SerializerAbstract from './SerializerAbstract'

export default class PlainSerializer extends SerializerAbstract {
  public async collection (data: Record<string, any>) {
    return data
  }

  public async item (data: Record<string, any>) {
    return data
  }

  public async null () {
    return null
  }

  public async meta (meta: Record<string, any>) {
    return { meta }
  }

  public async paginator (pagination: Record<string, any>) {
    return { pagination }
  }
}
