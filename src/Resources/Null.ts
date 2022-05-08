import ResourceAbstract from './ResourceAbstract'

export default class Null extends ResourceAbstract {
  constructor () {
    super(null, null)
  }

  public async getData () {
    return null
  }
}
