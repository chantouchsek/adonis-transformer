declare module '@ioc:Adonis/Addons/Transformer' {
    interface TransformerAbstractI {
        new (): any;
        availableInclude?: string[];
        defaultInclude?: string[];
        transform?(model: any): object;
        collection?(model: any, transformer: TransformerAbstractI | object): object;
        item?(model: any, transformer: TransformerAbstractI | object): object;
    }
    const TransformerAbstract: TransformerAbstractI;
    const Transformer: TransformerAbstractI;
}
