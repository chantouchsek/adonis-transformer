import SerializerAbstract from './SerializerAbstract';
export default class DataSerializer extends SerializerAbstract {
    collection(data: any): Promise<any>;
    item(data: any): Promise<any>;
    null(): Promise<null>;
    meta(meta: any): Promise<{
        meta: any;
    }>;
    paginator(pagination: any): Promise<{
        pagination: any;
    }>;
}
