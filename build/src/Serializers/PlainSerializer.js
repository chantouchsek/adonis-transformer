"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SerializerAbstract_1 = __importDefault(require("./SerializerAbstract"));
class PlainSerializer extends SerializerAbstract_1.default {
    async collection(data) {
        return data;
    }
    async item(data) {
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
exports.default = PlainSerializer;
