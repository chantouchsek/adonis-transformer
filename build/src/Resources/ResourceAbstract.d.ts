export default class ResourceAbstract {
    data: any;
    meta: null;
    transformer: any | string;
    variant: null | string;
    pagination: any;
    constructor(data: any, trans: any);
    getData(): Promise<any>;
    getTransformer(): any;
    setMeta(meta: any): this;
    getMeta(): null;
    setPagination(pagination: any): this;
    getPagination(): any;
    setVariant(variant: any): this;
    getVariant(): string | null;
    _separateTransformerAndVariation(transformerString: any): {
        transformer: any;
        variant: null;
    } | {
        transformer: string;
        variant: string | null;
    };
}
