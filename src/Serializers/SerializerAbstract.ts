export default class SerializerAbstract {
  public async collection (_data): Promise<any> {
    throw new Error('A Serializer must implement the method collection')
  }

  public async item (_data): Promise<any> {
    throw new Error('A Serializer must implement the method item')
  }

  public async null (_data): Promise<any> {
    throw new Error('A Serializer must implement the method null')
  }

  public async meta (_meta): Promise<any> {
    throw new Error('A Serializer must implement the method meta')
  }

  public async paginator (_data): Promise<any> {
    throw new Error('A Serializer must implement the method paginator')
  }

  public async mergeIncludes (data, includes): Promise<any> {
    // Include the includes data first.
    // If there is data with the same key as an include, data will take precedence.
    return Object.assign(includes, data)
  }
}

