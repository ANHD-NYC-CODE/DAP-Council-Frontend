import * as b from 'shared/constants/boundaries'

export class Boundary {
  constructor(objectConstant, id) {
    this.setObject = this.setObject.bind(this)

    this.setObject(objectConstant)

    this._id = id
  }

  setObject(objectConstant) {
    const object = b[Object.keys(b).find(obj => b[obj].constant === objectConstant)]
    if (object) {
      this._object = object
      this._name = this.object.name
      this._queryName = this.object.queryName
      this._constant = this.object.constant
    } else {
      throw `Pass either '${Object.keys(b)
        .map(key => b[key].constant)
        .join("' or '")}' as the first argument.`
    }
  }

  get object() {
    return this._object
  }
  get id() {
    return this._id
  }

  get name() {
    return this._name
  }
  get queryName() {
    return this._queryName
  }
  get constant() {
    return this._constant
  }

  set object(value) {
    this.setObject(value)
    this.id = undefined // Clear the ID to avoid boundary/id mismatches
  }

  set id(value) {
    this._id = value
  }
}
