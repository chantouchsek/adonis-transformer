"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SerializerAbstract_1 = __importDefault(require("./SerializerAbstract"));
class SLDataSerializer extends SerializerAbstract_1.default {
    async collection(data, depth = 0) {
        if (depth === 0) {
            return { data: data };
        }
        return data;
    }
    async item(data, depth = 0) {
        // if the item is an object, add it to the data property
        if (depth === 0 && data instanceof Object) {
            return { data: data };
        }
        // If the data for this item is not a object, aka. a primitive type
        // we will just return the plain data.
        return data;
    }
    async null() {
        return null;
    }
    async meta(meta) {
        return { meta: meta };
    }
    async paginator(pagination) {
        return { pagination: pagination };
    }
}
exports.default = SLDataSerializer;
