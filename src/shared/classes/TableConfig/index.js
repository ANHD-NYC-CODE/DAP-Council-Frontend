import BaseTable from 'shared/components/BaseTable'
import { getTableColumns, getKeyField, getDescriptionKey, getLinkProps } from 'shared/tables/tableColumns'
import { getDatasetDateField, constantToModelName } from 'shared/utilities/filterUtils'

export default class TableConfig {
  constructor({ component = BaseTable, resourceConstant = undefined, datasetModelName = undefined } = {}) {
    this._component = component
    this._resourceConstant = resourceConstant
    this._datasetModelName = datasetModelName || constantToModelName(this.resourceConstant)
  }

  get component() {
    return this._component
  }

  set component(component) {
    this._component = component
  }

  get resourceConstant() {
    return this._resourceConstant
  }

  set resourceConstant(resourceConstant) {
    this._resourceConstant = resourceConstant
  }

  get datasetModelName() {
    return this._datasetModelName
  }

  set datasetModelName(datasetModelName) {
    this._datasetModelName = datasetModelName
  }

  get hover() {
    return this._hover
  }

  set hover(hover) {
    this._hover = hover
  }

  get keyField() {
    return getKeyField(this._resourceConstant)
  }

  get descriptionKey() {
    return getDescriptionKey(this._resourceConstant)
  }

  getColumns({
    page,
    expandColumnFunction,
    constructFilter,
    baseTableConfig,
    rowExample,
    dispatch,
    annotationStart,
    advancedSearchDatasets,
  } = {}) {
    return getTableColumns({
      page,
      constant: this._resourceConstant,
      columnExpandFunction: expandColumnFunction,
      linkPropsFunction: getLinkProps(this._resourceConstant),
      constructFilter: constructFilter,
      baseTableConfig,
      dispatch: dispatch,
      rowExample,
      annotationStart: annotationStart,
      advancedSearchDatasets,
    })
  }

  get defaultSorted() {
    return [
      {
        dataField: getDatasetDateField(this._resourceConstant),
        order: 'desc',
      },
    ]
  }

  get tableRowClasses() {
    return 'table-row--collapsed'
  }
}
