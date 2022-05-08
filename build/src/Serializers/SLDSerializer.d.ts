import SerializerAbstract from './SerializerAbstract';
export default class SLDataSerializer extends SerializerAbstract {
    collection(data: any, depth?: number): Promise<any>;
    item(data: any, depth?: number): Promise<any>;
    null(): Promise<null>;
    meta(meta: any): Promise<{
        meta: any;
    }>;
    paginator(pagination: any): Promise<{
        pagination: any;
    }>;
}
