import SerializerAbstract from './SerializerAbstract'

export default class DataSerializer extends SerializerAbstract {
  public async collection (data): Promise<any> {
    return { data: data }
  }

  public async item (data) {
    // if the item is an object, add it to the data property
    if (data instanceof Object) {
      return { data: data }
    }

    // If the data for this item is not a object, aka. a primitive type
    // we will just return the plain data.
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
