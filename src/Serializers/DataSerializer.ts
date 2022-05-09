import SerializerAbstract from './SerializerAbstract'

export default class DataSerializer extends SerializerAbstract {
  public async collection (data: Record<string, any>) {
    return { data }
  }

  public async item (data: Record<string, any>) {
    // if the item is an object, add it to the data property
    if (data instanceof Object) {
      return { data }
    }

    // If the data for this item is not a object, aka. a primitive type
    // we will just return the plain data.
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
