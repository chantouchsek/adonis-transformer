import Scope from './Scope';
export default class TransformerAbstract {
    availableInclude: string[];
    defaultInclude: string[];
    transform(_data: any): void;
    collection(data: any, transformer: any): import("./Resources/Collection").default;
    item(data: any, transformer: any): import("./Resources/Item").default;
    null(): import("./Resources/Null").default;
    _processIncludedResources(parentScope: any, data: any): Promise<Record<string, any>>;
    _callIncludeFunction(include: any, parentScope: any, data: any): Promise<any>;
    _figureOutWhichIncludes(parentScope: any): string[];
    _createChildScopeFor(parentScope: any, resource: any, include: any): Scope;
    _eagerloadIncludedResource(resourcesToInclude: any, data: Record<string, any>): Promise<void>;
}
