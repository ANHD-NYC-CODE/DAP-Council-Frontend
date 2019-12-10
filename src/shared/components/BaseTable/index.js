import React from 'react'
import PropTypes from 'prop-types'
import { setDashboardTableState } from 'Store/DashboardState/actions'

import BootstrapTable from 'react-bootstrap-table-next'
import BaseTableConfig from 'shared/classes/BaseTableConfig'
import InnerLoader from 'shared/components/Loaders/InnerLoader'
import paginationFactory, {
  PaginationProvider,
  SizePerPageDropdownStandalone,
  PaginationListStandalone,
} from 'react-bootstrap-table2-paginator'
import filterFactory from 'react-bootstrap-table2-filter'
import TableHeader from 'shared/components/BaseTable/TableHeader'
import { Row, Col } from 'react-bootstrap'
import TableAlert from 'shared/components/BaseTable/TableAlert'
import CsvButton from 'shared/components/buttons/CsvButton'
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit'

import classnames from 'classnames'
import { fireCsvDownloadEvent } from 'Store/Analytics/actions'
import './style.scss'

class BaseTable extends React.Component {
  constructor(props) {
    super(props)
    this.setExpandedContent = this.setExpandedContent.bind(this)
    this.setPage = this.setPage.bind(this)
    this.setSizePerPage = this.setSizePerPage.bind(this)
    this.expandRow = this.expandRow.bind(this)
    this.constructFilter = this.constructFilter.bind(this)
    this.handleCsvClick = this.handleCsvClick.bind(this)
    this.constructCsvFilename = this.constructCsvFilename.bind(this)
    this.getTableSize = this.getTableSize.bind(this)
    this.baseTableConfig = new BaseTableConfig({ component: this })
    this.state = {
      expandedRowContent: '',
      displayedRecordsCount: (props.records || {}).length,
      page: props.globalTableState.page || 1,
      sizePerPage: props.globalTableState.sizePerPage || 10,
      defaultSorted: props.tableConfig.defaultSorted,
      expanded: [],
      columns: props.tableConfig.getColumns({
        expandColumnFunction: this.setExpandedContent,
        constructFilter: this.constructFilter,
        baseTableConfig: this.baseTableConfig,
        rowExample: props.records[0],
        dispatch: props.dispatch,
        annotationStart: props.annotationStart,
      }),
    }
  }

  componentDidUpdate(props, state) {
    if (props.records.length !== state.displayedRecordsCount) {
      this.setState({
        page: props.globalTableState.page || state.page,
        sizePerPage: props.globalTableState.sizePerPage || 10,
        displayedRecordsCount: props.records.length,
        defaultSorted: props.tableConfig.defaultSorted,
        columns: props.tableConfig.getColumns({
          expandColumnFunction: this.setExpandedContent,
          constructFilter: this.constructFilter,
          baseTableConfig: this.baseTableConfig,
          rowExample: props.records[0],
          dispatch: props.dispatch,
          annotationStart: props.annotationStart,
        }),
      })
    }
  }

  handleCsvClick() {
    this.props.dispatch(fireCsvDownloadEvent(this.constructCsvFilename(this.baseTableConfig.selectedFilters)))
  }

  constructCsvFilename(selectedFilters) {
    const filters = Object.keys(selectedFilters)
      .map(key => {
        if (selectedFilters[key]) {
          return key.split('__')[1].trim()
        }
      })
      .filter(f => f)
      .join('_')

    return `${this.props.csvBaseFileName}${filters ? '__' + filters : ''}.csv`.replace(' ', '_').toLowerCase()
  }

  setPage(page, sizePerPage) {
    if (this.props.globalTableState.page) {
      this.props.dispatch(
        setDashboardTableState({
          ...this.props.globalStableState,
          sizePerPage,
          page,
        })
      )
    }

    this.setState({
      page,
      sizePerPage,
    })
  }

  setSizePerPage(page, sizePerPage) {
    if (this.props.globalTableState.page) {
      const tableState = { ...this.props.globalTableState, sizePerPage }
      this.props.dispatch(
        setDashboardTableState({
          ...tableState,
          page,
        })
      )
    }

    this.setState({
      sizePerPage,
    })
  }

  setExpandedContent({ component, expandedRowProps, rowId, e }) {
    let expandedSet
    if (
      this.state.expanded.some(ex => ex === rowId) &&
      expandedRowProps.content === (this.state.expandedRowProps || {}).content
    ) {
      // Toggle off if clicked column twice
      expandedSet = []
      expandedRowProps = undefined
      // Remove active column class
      if (e.type === 'mouseenter') return // But not for mouseenter, only click
      e.currentTarget
        .closest('tbody')
        .querySelectorAll('td')
        .forEach(col => col.classList.remove('table-column--active'))
    } else {
      expandedSet = [rowId]
      // Add active column class
      e.currentTarget
        .closest('tbody')
        .querySelectorAll('td')
        .forEach(col => col.classList.remove('table-column--active'))
      e.currentTarget.classList.add('table-column--active')
    }

    this.setState({
      expandedRowProps,
      expandedRowComponent: component,
      expanded: expandedSet,
    })
  }

  expandRow() {
    const isNestedTable = component => {
      if (!component) return false
      return (
        component.name === 'NestedTable' ||
        (typeof component === 'function' && component.prototype && component.prototype.isReactComponent)
      )
    }
    return {
      onExpand: (row, isExpand, rowIndex, e) => {
        if (!e.currentTarget.classList.contains('expandable-cell')) return
      },
      renderer: row => {
        if (isNestedTable(this.state.expandedRowComponent)) {
          const NestedTable = this.state.expandedRowComponent

          return (
            <div className="table-row--nested-bumper" key={`expanded-row-${row.id}`}>
              <NestedTable nested={true} {...this.state.expandedRowProps} />
            </div>
          )
        } else if (this.state.expandedRowProps) {
          return this.state.expandedRowComponent(this.state.expandedRowProps)
        } else {
          return null
        }
      },

      expanded: this.state.expanded,
      showExpandColumn: false,
      onlyOneExpanding: true,
    }
  }

  constructFilter(filterType) {
    return filterType({
      getFilter: filter => {
        const filterKey = (Math.random() * 100000).toString()
        this.filters = { ...this.filters, [filterKey]: filter }
      },
    })
  }

  getTableSize(paginationProps, recordsSize = undefined) {
    const getDefaultSize = () => {
      const totalSize = recordsSize || paginationProps.totalSize
      return paginationProps.dataSize === paginationProps.totalSize
        ? paginationProps.totalSize
        : `${paginationProps.dataSize}/${totalSize}`
    }

    switch (this.props.tableConfig.resourceConstant) {
      case 'HPD_COMPLAINT': {
        return (
          <span className="text-left">
            <div>Total Complaints: {String(recordsSize)}</div>
            <div>
              Total Problems:{' '}
              {paginationProps.dataSize === paginationProps.totalSize
                ? paginationProps.totalSize
                : `${paginationProps.dataSize}/${paginationProps.totalSize}`}
            </div>
          </span>
        )
      }

      case 'DOB_ISSUED_PERMIT': {
        const totalInitial = this.props.request.resourceModel.tableRecordsCountFunction(this.props.records)
        return (
          <span className="text-left">
            <div>Total initial: {totalInitial}</div>
            <div>Total renewed: {recordsSize - totalInitial}</div>
          </span>
        )
      }

      default:
        return <span>Total: {getDefaultSize()}</span>
    }
  }

  render() {
    const { ExportCSVButton } = CSVExport
    return (
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          totalSize: this.props.records.length,
          sizePerPage: this.state.sizePerPage,
          sizePerPageList: [10, 50, 100],
          page: this.state.page,
          tableData: this.node ? this.node.table.props.data : [],
          onPageChange: (page, sizePerPage) => {
            this.setPage(page, sizePerPage)
          },
          onSizePerPageChange: (sizePerPage, page) => {
            this.setSizePerPage(page, sizePerPage)
          },
        })}
      >
        {({ paginationProps, paginationTableProps }) => {
          return (
            <ToolkitProvider
              keyField={`${this.props.tableConfig.keyField}`}
              data={this.props.records}
              columns={this.state.columns}
              exportCSV={{
                fileName: this.constructCsvFilename(this.baseTableConfig.selectedFilters),
              }}
              bootstrap4={true}
            >
              {toolKitProps => {
                return (
                  <div
                    className={`base-table ${this.props.wrapperClasses}`}
                    key={`table-${this.props.tableConfig.keyField}`}
                  >
                    {!this.props.nested && !!this.props.includeHeader && (
                      <Row>
                        <Col xs={12}>
                          <TableHeader
                            badge={this.props.badge}
                            property={this.props.property}
                            resourceConstant={this.props.tableConfig.resourceConstant}
                            datasetModelName={this.props.datasetModelName}
                            dispatch={this.props.dispatch}
                            showUpdate={this.props.showUpdate}
                            title={this.props.caption}
                          />
                        </Col>

                        <Col xs={4} className="text-right d-flex justify-content-start align-items-center">
                          {this.getTableSize(paginationProps, this.props.recordsSize)}
                        </Col>
                        <Col
                          xs={4}
                          className="table-header__share-column d-none d-md-flex justify-content-end align-items-center"
                        >
                          <CsvButton
                            parentComponent={this}
                            onClick={this.handleCsvClick}
                            ExportCSVButton={ExportCSVButton}
                            csvProps={toolKitProps.csvProps}
                          />
                        </Col>
                        <Col xs={4} className="d-flex align-items-center justify-content-end">
                          <SizePerPageDropdownStandalone btnContextual="btn-outline-primary" {...paginationProps} />
                        </Col>
                      </Row>
                    )}

                    <Row>
                      {!!this.baseTableConfig.filterButtonSets[this.props.tableConfig.resourceConstant] &&
                        this.baseTableConfig.filterButtonSets[this.props.tableConfig.resourceConstant].map(
                          (set, index) => {
                            return <Col key={`button-set${index}`}>{set(this.baseTableConfig.selectedFilters)}</Col>
                          }
                        )}
                    </Row>

                    <BootstrapTable
                      ref={n => (this.node = n)}
                      {...toolKitProps.baseProps}
                      {...paginationTableProps}
                      condensed
                      classes={classnames(this.props.classes, { 'no-expand': !this.props.expandable })}
                      defaultSorted={this.state.defaultSorted}
                      expandRow={this.props.expandable ? this.expandRow() : undefined}
                      filter={filterFactory()}
                      height="200px"
                      scrollTop="top"
                      noDataIndication={() =>
                        !this.props.loading && (
                          <TableAlert
                            textType="text-dark"
                            variant="warning"
                            message={'No records found'}
                            buttonText="Clear Filters"
                            buttonVariant="outline-secondary"
                          />
                        )
                      }
                      rowClasses={this.props.tableConfig.tableRowClasses}
                      tabIndexCell
                    />
                    {this.props.loading && <InnerLoader />}
                    {this.props.error && (
                      <TableAlert
                        variant="danger"
                        textType="text-danger"
                        message={this.props.error.message}
                        action={this.props.errorAction}
                      />
                    )}
                    {!this.props.nested &&
                      !!this.props.includeHeader &&
                      paginationProps.sizePerPage < this.props.records.length && (
                        <Row>
                          <Col xs={6}>
                            <PaginationListStandalone {...paginationProps} />
                          </Col>
                        </Row>
                      )}
                  </div>
                )
              }}
            </ToolkitProvider>
          )
        }}
      </PaginationProvider>
    )
  }
}

BaseTable.defaultProps = {
  globalTableState: {},
  expandable: true,
  includeHeader: true,
  nested: false,
  recordsSize: 0,
  request: undefined,
}

BaseTable.propTypes = {
  annotationStart: PropTypes.string,
  caption: PropTypes.string,
  classes: PropTypes.string,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  expandable: PropTypes.bool,
  globalTableState: PropTypes.object,
  loading: PropTypes.bool,
  nested: PropTypes.bool,
  records: PropTypes.array,
  recordsSize: PropTypes.number,
  tableConfig: PropTypes.object,
}

export default BaseTable
