"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = __importDefault(require("./Manager"));
const Resources_1 = __importDefault(require("./Resources"));
class Transformer {
    constructor(manager) {
        this._manager = manager;
        return this;
    }
    static create(data = null, transformer = null) {
        // create an instance of src and pass a new instance of Manager
        const instance = new Transformer(new Manager_1.default());
        // initialize data and transformer properties
        instance._data = data;
        instance._dataType = instance._determineDataType(data);
        instance._transformer = transformer;
        instance._variant = null;
        // set pagination, context and meta properties to null
        instance._pagination = null;
        instance._context = null;
        instance._meta = null;
        // return the instance for the fluid interface
        return instance;
    }
    collection(data, transformer = null) {
        this._setData('Collection', data);
        if (transformer) {
            this.transformWith(transformer);
            return this.toJSON();
        }
        return this;
    }
    item(data, transformer = null) {
        this._setData('Item', data);
        if (transformer) {
            this.transformWith(transformer);
            return this.toJSON();
        }
        return this;
    }
    null() {
        this._setData('Null', null);
        return this;
    }
    paginate(data, transformer = null) {
        this._setData('Collection', data.rows);
        // set pagination data
        this._pagination = data.getMeta();
        if (transformer) {
            this.transformWith(transformer);
            return this.toJSON();
        }
        return this;
    }
    meta(meta) {
        this._meta = meta;
        return this;
    }
    transformWith(transformer) {
        this._transformer = transformer;
        return this;
    }
    usingVariant(variant) {
        this._variant = variant;
        return this;
    }
    withContext(ctx) {
        this._ctx = ctx;
        return this;
    }
    include(include) {
        this._manager.parseIncludes(include);
        return this;
    }
    setSerializer(serializer) {
        this._manager.setSerializer(serializer);
        return this;
    }
    serializeWith(serializer) {
        return this.setSerializer(serializer);
    }
    toArray() {
        console.warn('Deprecation warning: Calling #toArray() is deprecated. Please us #toJSON() instead.');
        return this.toJSON();
    }
    toJSON() {
        return this._createData().toJSON();
    }
    _setData(dataType, data) {
        this._data = data;
        this._dataType = dataType;
        this._pagination = null;
        return this;
    }
    _createData() {
        return this._manager.createData(this._getResource(), this._ctx);
    }
    _getResource() {
        const Resource = Resources_1.default[this._dataType];
        const resourceInstance = new Resource(this._data, this._transformer);
        resourceInstance.setMeta(this._meta);
        resourceInstance.setPagination(this._pagination);
        resourceInstance.setVariant(this._variant);
        return resourceInstance;
    }
    _determineDataType(data) {
        if (data === null) {
            return 'Null';
        }
        if (Array.isArray(data)) {
            return 'Collection';
        }
        return 'Item';
    }
}
exports.default = Transformer;
