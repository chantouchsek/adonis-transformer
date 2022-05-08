import ResourceAbstract from './ResourceAbstract';
export default class Null extends ResourceAbstract {
    constructor();
    getData(): Promise<null>;
}
