import { StandardizedInput } from 'shared/classes/StandardizedInput'

export class Condition {
  constructor({ key = undefined, type = undefined, filters = [] } = {}) {
    this._key = key
    this._type = type
    this._filters = filters
  }

  get key() {
    return this._key
  }

  get type() {
    return this._type
  }

  set type(type) {
    this._type = type
  }

  get filters() {
    return this._filters
  }

  set filters(filters) {
    this._filters = filters
  }

  toggleAndOrConditionType(e) {
    if (e && !(e instanceof StandardizedInput))
      throw 'please pass a StandardizedInput class instance into the "e" parameter'

    if (e.value.toUpperCase() === 'AND') {
      this._type = 'OR'
    } else if (e.value.toUpperCase() === 'OR') {
      this._type = 'AND'
    }
  }

  hasCondition() {
    return this._filters.some(filter => filter.conditionGroup)
  }

  addFilter({ filter }) {
    // Adds condition groups to the end
    if (filter.conditionGroup) {
      this._filters = [...this._filters, filter]
    } else {
      let conditionGroups = this.filters.filter(f => f.conditionGroup)
      this.filters = this.filters.filter(f => !f.conditionGroup)
      this._filters = [...this._filters, filter]
      this.filters = this.filters.concat(conditionGroups)
    }
  }

  removeFilter({ filterIndex }) {
    this._filters = this._filters.filter((f, index) => index !== filterIndex)
  }
}