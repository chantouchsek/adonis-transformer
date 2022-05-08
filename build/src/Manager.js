"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Ioc } from '@adonisjs/fold'
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const Scope_1 = __importDefault(require("./Scope"));
const Serializers_1 = __importDefault(require("./Serializers"));
// import { ConfigContract } from '@ioc:Adonis/Core/Config'
// const ioc = new Ioc()
class Manager {
    constructor() {
        this.serializer = null;
        this.requestedIncludes = new Set();
        this._recursionLimit = 10;
    }
    createData(resource, ctx = {}) {
        this._setIncludesFromRequest(ctx);
        return new Scope_1.default(this, resource, ctx);
    }
    getRequestedIncludes(transformCamelCase = false) {
        if (!transformCamelCase) {
            return this.requestedIncludes;
        }
        const includes = [...this.requestedIncludes]
            .map(i => i.split('.').map(camelCase_1.default).join('.'));
        return new Set(includes);
    }
    parseIncludes(includes) {
        this.requestedIncludes = new Set();
        // if a string is passed, split by comma and return an array
        if (typeof includes === 'string') {
            includes = includes.split(',');
        }
        // if it is not an array, we can not parse it at this point
        if (!Array.isArray(includes)) {
            throw Error(`The parseIncludes() method expects a string or an array. ${typeof includes} given`);
        }
        // sanitize the includes
        includes = includes.map(i => this._guardAgainstToDeepRecursion(i));
        // add all includes to the internal set
        includes.forEach(this.requestedIncludes.add, this.requestedIncludes);
        this._autoIncludeParents();
    }
    setRecursionLimit(limit) {
        this._recursionLimit = limit;
        return this;
    }
    setSerializer(serializer) {
        if (typeof serializer === 'string') {
            serializer = new Serializers_1.default[serializer]();
        }
        this.serializer = serializer;
    }
    getSerializer() {
        if (!this.serializer) {
            this.setSerializer('plain');
        }
        return this.serializer;
    }
    _guardAgainstToDeepRecursion(include) {
        return include.split('.').slice(0, this._recursionLimit).join('.');
    }
    _autoIncludeParents() {
        const parsed = [];
        // for each resource that is requested
        for (const include of this.requestedIncludes) {
            // we split it by '.' to get the recursions
            const nested = include.split('.');
            // Add the first level to the includes
            let part = nested.shift();
            parsed.push(part);
            // if there are more nesting levels,
            // add each level to the includes
            while (nested.length) {
                part += `.${nested.shift()}`;
                parsed.push(part);
            }
        }
        // add all parsed includes to the set of requested includes
        parsed.forEach(this.requestedIncludes.add, this.requestedIncludes);
    }
    _setIncludesFromRequest(ctx) {
        // const Config: ConfigContract = ioc.use('Adonis/Core/Config')
        //
        // // Only parse includes if enabled in config
        // if (!Config.get('bumblebee.parseRequest', false)) {
        //   return
        // }
        // get all get parameters from the request
        const params = (ctx.request && ctx.request.all()) || {};
        // if the 'include' parameter is set, pass it the the parse method
        if (params.include) {
            console.warn('param', params);
            this.parseIncludes(params.include);
        }
    }
}
exports.default = Manager;
