"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceAbstract {
    constructor(data, trans) {
        this.data = data;
        this.meta = null;
        const { transformer, variant } = this._separateTransformerAndVariation(trans);
        this.transformer = transformer;
        this.variant = variant;
    }
    async getData() {
        // data can be a promise, so we wait until it resolves
        const data = await this.data;
        // if data is a lucid collection, return just the array with the data
        if (data && data.rows) {
            return data.rows;
        }
        // data is an item, so we return it as is
        return data;
    }
    getTransformer() {
        return this.transformer;
    }
    setMeta(meta) {
        this.meta = meta;
        return this;
    }
    getMeta() {
        return this.meta;
    }
    setPagination(pagination) {
        this.pagination = pagination;
        return this;
    }
    getPagination() {
        return this.pagination;
    }
    setVariant(variant) {
        if (variant) {
            this.variant = variant;
        }
        return this;
    }
    getVariant() {
        return this.variant;
    }
    _separateTransformerAndVariation(transformerString) {
        // This feature is only available when a string binding is used
        if (typeof transformerString !== 'string') {
            return { transformer: transformerString, variant: null };
        }
        const regex = /(.*)\.(.*)/;
        const matches = transformerString.match(regex);
        // if the string did not contain a variation use the
        // transformerString is used and the variation is set to null
        const transformer = matches ? matches[1] : transformerString;
        const variant = matches ? matches[2] : null;
        return { transformer, variant };
    }
}
exports.default = ResourceAbstract;
