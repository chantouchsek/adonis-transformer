export default class SerializerAbstract {
    collection(_data: any): Promise<any>;
    item(_data: any): Promise<any>;
    null(_data: any): Promise<any>;
    meta(_meta: any): Promise<any>;
    paginator(_data: any): Promise<any>;
    mergeIncludes(data: any, includes: any): Promise<any>;
}
