"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceAbstract_1 = __importDefault(require("./ResourceAbstract"));
class Null extends ResourceAbstract_1.default {
    constructor() {
        super(null, null);
    }
    async getData() {
        return null;
    }
}
exports.default = Null;
