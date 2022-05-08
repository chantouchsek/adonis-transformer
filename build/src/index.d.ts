export default class Transformer {
    _data: any;
    _dataType: string;
    _transformer: any;
    _variant: null;
    _pagination: null;
    _context: null;
    _manager: any;
    _meta: any;
    _ctx: any;
    static create(data?: null, transformer?: null): Transformer;
    constructor(manager: any);
    collection(data: any, transformer?: null): any;
    item(data: any, transformer?: null): any;
    null(): this;
    paginate(data: any, transformer?: null): any;
    meta(meta: any): this;
    transformWith(transformer: any): this;
    usingVariant(variant: any): this;
    withContext(ctx: any): this;
    include(include: any): this;
    setSerializer(serializer: any): this;
    serializeWith(serializer: any): this;
    toArray(): any;
    toJSON(): any;
    _setData(dataType: any, data: any): this;
    _createData(): any;
    _getResource(): any;
    _determineDataType(data: any): "Null" | "Collection" | "Item";
}