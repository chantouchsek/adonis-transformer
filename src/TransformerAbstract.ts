import Resources from './Resources'
import _camelCase from 'lodash/camelCase'
import Scope from'./Scope'

export default class TransformerAbstract {
  public availableInclude: string[] = []
  public defaultInclude: string[] = []

  public transform (_data: any) {
    throw new Error('You have to implement the method transform or specify a variant when calling the transformer!')
  }

  public collection (data, transformer) {
    return new Resources.Collection(data, transformer)
  }

  public item (data, transformer) {
    return new Resources.Item(data, transformer)
  }

  public null () {
    return new Resources.Null()
  }

  public async _processIncludedResources (parentScope, data) {
    const includeData: Record<string, any> = {}

    // figure out which of the available includes are requested
    const resourcesToInclude = this._figureOutWhichIncludes(parentScope)

    // load related lucid models
    await this._eagerloadIncludedResource(resourcesToInclude, data)

    // for each include call the include function for the transformer
    for (const include of resourcesToInclude) {
      const resource = await this._callIncludeFunction(include, parentScope, data)

      // if the include uses a resource, run the data through the transformer chain
      if (resource instanceof Resources.ResourceAbstract) {
        includeData[include] = await this._createChildScopeFor(parentScope, resource, include).toJSON()
      } else {
        // otherwise, return the data as is
        includeData[include] = resource
      }
    }

    return includeData
  }

  public async _callIncludeFunction (include, parentScope, data) {
    // convert the include name to camelCase
    include = _camelCase(include)
    const includeName = `include${include.charAt(0).toUpperCase()}${include.slice(1)}`

    if (!(this[includeName] instanceof Function)) {
      throw new Error(`A method called '${includeName}' could not be found in '${this.constructor.name}'`)
    }

    return this[includeName](data, parentScope._ctx)
  }

  public _figureOutWhichIncludes (parentScope) {
    const includes = this.defaultInclude

    const requestedAvailableIncludes = this.availableInclude.filter(i => parentScope._isRequested(i))

    return includes.concat(requestedAvailableIncludes)
  }

  public _createChildScopeFor (parentScope, resource, include) {
    // create a new scope
    const childScope = new Scope(parentScope._manager, resource, parentScope._ctx, include)

    // get the scope for this transformer
    const scopeArray = [...parentScope.getParentScopes()]

    if (parentScope.getScopeIdentifier()) {
      scopeArray.push(parentScope.getScopeIdentifier())
    }

    // set the parent scope for the new child scope
    childScope.setParentScopes(scopeArray)

    return childScope
  }

  public async _eagerloadIncludedResource (resourcesToInclude, data: Record<string, any>) {
    // if there is no loadMany function, return since it probably is not a lucid model
    if (!data.loadMany) {
      return
    }

    // figure out which resources should be loaded
    const resourcesToLoad = resourcesToInclude.filter(resource => {
      // check that a relation method exists and that the relation was not previously loaded.
      return (data[resource] instanceof Function) &&
        !data.related(resource).query() && data.$relations[resource] !== null
    })

    // if no resources should be loaded, return
    if (!resourcesToLoad.length) {
      return
    }

    // load all resources
    await data.loadMany(resourcesToLoad)
  }
}
