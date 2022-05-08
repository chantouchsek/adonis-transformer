export default class Scope {
    _manager: any;
    _resource: any;
    _ctx: any;
    _scopeIdentifier: any;
    _parentScopes: any[];
    constructor(manager: any, resource: any, ctx: any, scopeIdentifier?: null);
    toJSON(): Promise<any>;
    _executeResourceTransformers(): Promise<any[]>;
    _fireTransformer(data: any, transformer: any): Promise<any[]>;
    _serializeResource(serializer: any, rawData: any): Promise<any>;
    _isRequested(checkScopeSegment: any): any;
    _getTransformerInstance(Transformer: any): any;
    _resolveTransformer(transformer: any): Promise<any>;
    _dispatchToTransformerVariant(transformerInstance: any, data: any, ctx: any): Promise<any>;
    _transformerHasIncludes(Transformer: any): boolean;
    setParentScopes(parentScopes: any): void;
    getParentScopes(): any[];
    getScopeIdentifier(): any;
    getScopeArray(): any[];
}
