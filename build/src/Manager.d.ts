import Scope from './Scope';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
export default class Manager {
    serializer: null;
    requestedIncludes: Set<any>;
    _recursionLimit: number;
    constructor();
    createData(resource: any, ctx?: {}): Scope;
    getRequestedIncludes(transformCamelCase?: boolean): Set<any>;
    parseIncludes(includes: any): void;
    setRecursionLimit(limit: number): this;
    setSerializer(serializer: any): void;
    getSerializer(): null;
    _guardAgainstToDeepRecursion(include: any): any;
    _autoIncludeParents(): void;
    _setIncludesFromRequest(ctx: HttpContextContract): void;
}
