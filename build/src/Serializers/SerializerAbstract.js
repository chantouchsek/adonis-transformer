"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SerializerAbstract {
    async collection(_data) {
        throw new Error('A Serializer must implement the method collection');
    }
    async item(_data) {
        throw new Error('A Serializer must implement the method item');
    }
    async null(_data) {
        throw new Error('A Serializer must implement the method null');
    }
    async meta(_meta) {
        throw new Error('A Serializer must implement the method meta');
    }
    async paginator(_data) {
        throw new Error('A Serializer must implement the method paginator');
    }
    async mergeIncludes(data, includes) {
        // Include the includes data first.
        // If there is data with the same key as an include, data will take precedence.
        return Object.assign(includes, data);
    }
}
exports.default = SerializerAbstract;
