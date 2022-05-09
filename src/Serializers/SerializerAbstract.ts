export default abstract class SerializerAbstract {
  public abstract collection (data: Record<string, any>, depth?: number): Promise<Record<string, any>>
  public abstract item (data: Record<string, any>, depth?: number): Promise<Record<string, any>>
  public abstract null (data: Record<string, any> | number | null): Promise<null>
  public abstract meta (meta: Record<string, any>): Promise<Record<string, any>>
  public abstract paginator (data: Record<string, any>): Promise<Record<string, any>>
  public async mergeIncludes (data: Record<string, any>, includes: Record<string, any>): Promise<Record<string, any>> {
    // Include the includes data first.
    // If there is data with the same key as an include, data will take precedence.
    return Object.assign(includes, data)
  }
}

