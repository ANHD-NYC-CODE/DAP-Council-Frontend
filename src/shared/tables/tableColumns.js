import React from 'react'
import * as c from 'shared/constants'
import { textFilter } from 'react-bootstrap-table2-filter'
import TableConfig from 'shared/classes/TableConfig'
import ExpandedLinkRow from 'shared/components/BaseTable/ExpandedLinkRow'
import { push } from 'connected-react-router'
import { addressResultToPath } from 'shared/utilities/routeUtils'
import BaseTable from 'shared/components/BaseTable'
import moment from 'moment'
import {
  dateFormatter,
  annotatedColumnFormatter,
  bldgClassFormater,
  dobComplaintCategoryFormatter,
  dobPermitWorkTypeFormatter,
  acrisDocTypeFormatter,
  dollarFormatter,
  dobPermitSourceFormatter,
  expandTableFormatter,
  linkFormatter,
  hpdStatusFormatter,
  lispendenCleanupFormatter,
  dobViolationStatusFormatter,
  capitalizeFormatter,
} from 'shared/utilities/tableUtils'

export const getKeyField = constant => {
  switch (constant) {
    case 'PROPERTY':
      return 'bbl'
    case 'BUILDING':
      return 'bin'
    case 'RENT_STABILIZATION_RECORD':
      return 'ucbbl'
    case 'HPD_REGISTRATION':
      return 'registrationid'
    case 'HPD_CONTACT':
      return 'registrationcontactid'
    case 'HPD_VIOLATION':
      return 'violationid'
    case 'HPD_COMPLAINT':
      return 'complaintid'
    case 'HPD_PROBLEM':
      return 'problemid'
    case 'DOB_VIOLATION':
      return 'isndobbisviol'
    case 'DOB_COMPLAINT':
      return 'complaintnumber'
    case 'ECB_VIOLATION':
      return 'ecbviolationnumber'
    case 'DOB_ISSUED_PERMIT':
      return 'key'
    case 'DOB_FILED_PERMIT':
      return 'key'
    case 'HOUSING_LITIGATION':
      return 'litigationid'
    case 'ACRIS_REAL_MASTER':
      return 'documentid'
    case 'ACRIS_REAL_PARTY':
      return 'key'
    case 'EVICTION':
      return 'courtindexnumber'
    case 'LISPENDEN':
      return 'key'
    default:
      return 'id'
  }
}

export const getLinkId = constant => {
  switch (constant) {
    case 'PROPERTY':
      return 'bbl'
    case 'DOB_VIOLATION':
      return 'isndobbisviol'
    case 'ECB_VIOLATION':
      return 'ecbviolationnumber'
    case 'DOB_COMPLAINT':
      return 'complaintnumber'
    case 'DOB_ISSUED_PERMIT':
      return 'jobfilingnumber'
    case 'DOB_FILED_PERMIT':
      return 'jobfilingnumber'
    case 'ACRIS_REAL_MASTER':
      return 'documentid'
    default:
      return 'id'
  }
}

export const getLinkProps = constant => {
  switch (constant) {
    case 'PROPERTY':
      return ({ linkId } = {}) => ({ href: `/property/${linkId}`, linkText: 'View Property' })
    case 'HPD_VIOLATION':
      return () => ({ href: 'https://www1.nyc.gov/site/hpd/about/hpdonline.page', linkText: 'Search HPD Online' })
    case 'HPD_COMPLAINT':
      return () => ({ href: 'https://www1.nyc.gov/site/hpd/about/hpdonline.page', linkText: 'Search HPD Online' })
    case 'HOUSING_LITIGATION':
      return () => ({ href: 'https://www1.nyc.gov/site/hpd/about/hpdonline.page', linkText: 'Search HPD Online' })
    case 'DOB_VIOLATION':
      return ({ linkId, bin }) => ({
        href: `http://a810-bisweb.nyc.gov/bisweb/ActionViolationDisplayServlet?requestid=2&allbin=${bin}&allinquirytype=BXS3OCV4&allboroughname=&allstrt=&allnumbhous=&allisn=${linkId.padStart(
          10,
          '0'
        )}&ppremise60=080410B282913`,
        linkText: 'View BIS Record',
      })
    case 'ECB_VIOLATION':
      return ({ linkId }) => ({
        href: `http://a810-bisweb.nyc.gov/bisweb/ECBQueryByNumberServlet?ecbin=${linkId}&go7=+GO+&requestid=0`,
        linkText: 'View BIS Record',
      })
    case 'DOB_COMPLAINT':
      return ({ linkId }) => ({
        href: `http://a810-bisweb.nyc.gov/bisweb/OverviewForComplaintServlet?complaintno=${linkId}&go6=+GO+&requestid=0`,
        linkText: 'View BIS Record',
      })
    case 'DOB_ISSUED_PERMIT':
      return ({ linkId }) => ({
        href: `http://a810-bisweb.nyc.gov/bisweb/JobsQueryByNumberServlet?passjobnumber=${linkId}&passdocnumber=&go10=+GO+&requestid=0`,
        linkText: 'View BIS Record',
      })
    case 'DOB_FILED_PERMIT':
      return ({ linkId }) => ({
        href: `http://a810-bisweb.nyc.gov/bisweb/JobsQueryByNumberServlet?passjobnumber=${linkId}&passdocnumber=&go10=+GO+&requestid=0`,
        linkText: 'View BIS Record',
      })
    case 'ACRIS_REAL_MASTER':
      return ({ linkId }) => ({
        href: `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentDetail?doc_id=${linkId}`,
        linkText: 'View ACRIS Document',
      })
    default:
      return () => null
  }
}

export const getDescriptionKey = constant => {
  switch (constant) {
    case 'PROPERTY':
      return 'bldgclass'
    case 'HPD_VIOLATION':
      return 'novdescription'
    case 'DOB_VIOLATION':
      return 'description'
    case 'DOB_COMPLAINT':
      return 'complaintcategory'
    case 'ECB_VIOLATION':
      return 'violationdescription'
    case 'DOB_ISSUED_PERMIT':
      return 'jobdescription'
    case 'DOB_FILED_PERMIT':
      return 'jobdescription'
  }
}

export const getTableColumns = ({
  constant,
  columnExpandFunction,
  linkPropsFunction = () => null,
  constructFilter,
  baseTableConfig,
  dispatch,
  rowExample,
  annotationStart = c.DISTRICT_REQUEST_DATE_ONE,
} = {}) => {
  let columns

  const getAnnotatedDataField = ({ annotationKey = '', rowExample = undefined } = {}) => {
    if (!rowExample) return ''
    const columnKey = Object.keys(rowExample).find(key => key.match(annotationKey))

    return columnKey
  }

  const getAnnotatedLabel = ({ annotationLabel = '', annotationKey = '', rowExample = undefined } = {}) => {
    if (!rowExample) return ''
    const columnKey = Object.keys(rowExample).find(key => key.match(annotationKey))
    if (!columnKey) return ''
    const startDate = columnKey.split('__')[1].split('-')[0]
    const endDate = columnKey.split('__')[1].split('-')[1]

    return `${annotationLabel} (${startDate} - ${endDate})`
  }

  const handleColumnEvent = ({ e, row, component, dataKey, tableConfig } = {}) => {
    const rowKey = getKeyField(constant)

    columnExpandFunction({
      component,
      expandedRowProps: {
        records: row[dataKey],
        tableConfig,
        content: e.target.textContent,
        ...linkPropsFunction({ linkId: row[getLinkId(constant)], bin: row.bin }),
      },
      rowId: row[rowKey],
      e,
    })
  }

  const linkToColumnEvent = ({ row } = {}) => {
    dispatch(push(addressResultToPath({ bbl: row.bbl })))
  }

  const expandColumnEvent = ({ e, column, row, component } = {}) => {
    if (e.target.closest('table').classList.contains('no-expand')) return e
    handleColumnEvent({ e, column, row, component })
  }

  const expandNestedColumnEvent = ({ e, column, row, component, dataKey, tableConfig } = {}) => {
    if (e.target.closest('table').classList.contains('no-expand')) return e
    handleColumnEvent({ e, column, row, component, dataKey, tableConfig })
  }

  const constructPropertyColumn = ({
    dataField,
    text,
    sort,
    filter,
    classes,
    formatter,
    hidden,
    csvExport,
    csvFormatter,
    columnEvent,
  }) => {
    if (!dataField) return null
    return {
      dataField,
      text,
      sort,
      filter,
      classes,
      formatter,
      hidden,
      csvExport,
      csvFormatter,
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          if (columnEvent) return columnEvent({ row })
        },
      },
    }
  }

  const constructStandardColumn = ({
    dataField,
    text,
    sort,
    filter,
    classes,
    headerClasses,
    formatter,
    hidden,
    csvExport,
    csvFormatter,
    component = ExpandedLinkRow,
    columnEvent,
  }) => {
    return {
      dataField,
      text,
      sort,
      filter,
      classes,
      headerClasses,
      formatter,
      hidden,
      csvExport,
      csvFormatter,
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          if (columnEvent) return columnEvent({ e, column, row, component })
        },
      },
    }
  }

  const constructNestedTableColumn = ({
    dataField,
    text,
    sort,
    filter,
    classes,
    formatter,
    hidden,
    csvExport,
    csvFormatter,
    component = BaseTable,
    dataKey,
    tableConfig,
    columnEvent,
  }) => {
    return {
      dataField,
      text,
      sort,
      filter,
      classes,
      formatter,
      hidden,
      csvExport,
      csvFormatter,
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          if (columnEvent) return columnEvent({ e, column, row, component, dataKey, tableConfig })
        },
      },
    }
  }

  const getAnnotationKey = (datasetKey, annotationStart = undefined) => {
    if (annotationStart) {
      return `${datasetKey}_${annotationStart}`
    }

    return `${datasetKey}`
  }

  switch (constant) {
    case 'PROPERTY':
      columns = [
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'bbl',
          text: 'BBL',
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'address',
          text: 'Address',
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'yearbuilt',
          text: 'Year Built',
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'unitstotal',
          text: 'Total Units',
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'unitsres',
          text: 'Residential Units',
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'unitsrentstabilized',
          text: 'Rent Stabilized Units',
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: 'latestsaleprice',
          text: 'Latest sale price',
          formatter: dollarFormatter,
          csvFormatter: annotatedColumnFormatter,
          sort: true,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('hpdviolations', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'HPD Violations',
            rowExample,
            annotationKey: getAnnotationKey('hpdviolations', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('dobviolations', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'DOB Violations',
            rowExample,
            annotationKey: getAnnotationKey('dobviolations', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('ecbviolations', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'ECB Violations',
            rowExample,
            annotationKey: getAnnotationKey('ecbviolations', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('hpdcomplaints', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'HPD Complaints',
            rowExample,
            annotationKey: getAnnotationKey('hpdcomplaints', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('dobcomplaints', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'DOB Complaints',
            rowExample,
            annotationKey: getAnnotationKey('dobcomplaints', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('dobfiledpermits', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'DOB Permit Applications',
            rowExample,
            annotationKey: getAnnotationKey('dobfiledpermits', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('dobissuedpermits', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'DOB Permit Issuances',
            rowExample,
            annotationKey: getAnnotationKey('dobissuedpermits', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('housinglitigations', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'Litigations against landlords',
            rowExample,
            annotationKey: getAnnotationKey('housinglitigations', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('evictions', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'Marshall Evictions',
            rowExample,
            annotationKey: getAnnotationKey('evictions', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('acrisrealmasters', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'Sales',
            rowExample,
            annotationKey: getAnnotationKey('acrisrealmasters', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
        constructPropertyColumn({
          columnEvent: linkToColumnEvent,
          dataField: getAnnotatedDataField({
            annotationKey: getAnnotationKey('lispendens', annotationStart),
            rowExample,
          }),
          text: getAnnotatedLabel({
            annotationLabel: 'Foreclosures',
            rowExample,
            annotationKey: getAnnotationKey('lispendens', annotationStart),
          }),
          sort: true,
          formatter: annotatedColumnFormatter,
          csvFormatter: annotatedColumnFormatter,
        }),
      ].filter(c => c)
      break
    case 'HPD_REGISTRATION':
      columns = [
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'registrationid',
          text: 'ID',
          hidden: true,
        }),
        // constructStandardColumn({
        //   columnEvent: expandColumnEvent,
        //   dataField: 'lastregistrationdate',
        //   text: 'Last Registration Date',
        //   formatter: dateFormatter,
        //   csvFormatter: dateFormatter,
        //   sort: true,
        // }),
        constructStandardColumn({
          dataField: 'lastregistrationdate',
          text: 'Last Registration Date',
        }),
        constructNestedTableColumn({
          columnEvent: expandNestedColumnEvent,
          dataField: 'contacts',
          text: 'View Contacts',
          formatter: expandTableFormatter,
          dataKey: 'contacts',
          classes: 'nested-table-column',
          tableConfig: new TableConfig({ resourceConstant: 'HPD_CONTACT' }),
        }),
      ]
      break
    case 'RENT_STABILIZATION_RECORD':
      columns = [
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'ucbbl',
          text: 'ID',
          hidden: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2007',
          text: '2007',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2008',
          text: '2008',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2009',
          text: '2009',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2010',
          text: '2010',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2011',
          text: '2011',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2012',
          text: '2012',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2013',
          text: '2013',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2014',
          text: '2014',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2015',
          text: '2015',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2016',
          text: '2016',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2017',
          text: '2017',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2018',
          text: '2018',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2019',
          text: '2019',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2020',
          text: '2020',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2021',
          text: '2021',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'uc2022',
          text: '2022',
        }),
      ]
      break
    case 'HPD_VIOLATION':
      columns = [
        constructStandardColumn({
          dataField: 'violationid',
          text: 'Violation ID',
        }),
        constructStandardColumn({
          dataField: 'approveddate',
          text: 'Date Approved',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'class_name',
          text: 'Class',
          filter: baseTableConfig.filterPrototypes['HPD_VIOLATION_CLASS'],
          headerClasses: 'hide-filter',
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'novdescription',
          text: 'Description',
          filter: constructFilter(textFilter),
          classes: 'table-column--description',
        }),
        constructStandardColumn({
          dataField: 'violationstatus',
          text: 'Violation Status',
          filter: baseTableConfig.filterPrototypes['HPD_VIOLATION_OPEN'],
          headerClasses: 'hide-filter',
          formatter: hpdStatusFormatter,
          sort: true,
        }),
      ]
      break
    case 'HPD_CONTACT':
      columns = [
        constructStandardColumn({
          dataField: 'type',
          text: 'Type',
        }),
        constructStandardColumn({
          dataField: 'title',
          text: 'Title',
        }),

        constructStandardColumn({
          dataField: 'firstname',
          text: 'First Name',
        }),
        constructStandardColumn({
          dataField: 'lastname',
          text: 'Last Name',
        }),
        constructStandardColumn({
          dataField: 'corporationname',
          text: 'Corp Name',
        }),
        constructStandardColumn({
          dataField: 'businesshousenumber',
          text: 'Address No.',
        }),
        constructStandardColumn({
          dataField: 'businessstreetname',
          text: 'Street',
        }),
        constructStandardColumn({
          dataField: 'businessapartment',
          text: 'Apt.',
        }),
        constructStandardColumn({
          dataField: 'businesscity',
          text: 'City',
        }),
        constructStandardColumn({
          dataField: 'businessstate',
          text: 'State',
        }),
        constructStandardColumn({
          dataField: 'businesszip',
          text: 'Zip',
        }),
      ]
      break
    case 'HPD_COMPLAINT':
      columns = [
        constructStandardColumn({
          dataField: 'complaintid',
          text: 'Complaint ID',
        }),
        constructStandardColumn({
          dataField: 'receiveddate',
          text: 'Date Received',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'apartment',
          text: 'Apt.',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'status',
          text: 'Status',
          filter: baseTableConfig.filterPrototypes['HPD_COMPLAINT_OPEN'],
          headerClasses: 'hide-filter',
          sort: true,
          formatter: hpdStatusFormatter,
        }),
        constructNestedTableColumn({
          columnEvent: expandNestedColumnEvent,
          dataField: 'hpdproblems',
          text: 'View Problems',
          formatter: expandTableFormatter,
          dataKey: 'hpdproblems',
          classes: 'nested-table-column',
          tableConfig: new TableConfig({ resourceConstant: 'HPD_PROBLEM' }),
        }),
      ]
      break
    case 'HPD_PROBLEM':
      columns = [
        constructStandardColumn({
          dataField: 'problemid',
          text: 'Problem ID',
        }),
        constructStandardColumn({
          dataField: 'type',
          text: 'Urgency',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'unittype',
          text: 'Unit Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'spacetype',
          text: 'Space Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'majorcategory',
          text: 'Major Category',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'minorcategory',
          text: 'Minor Category',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'code',
          text: 'Descriptor',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'statusdescription',
          text: 'Full Description',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'DOB_VIOLATION':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'DOB_VIOLATION', 'isndobbisviol'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'isndobbisviol',
          text: 'Violation #',
        }),
        constructStandardColumn({
          dataField: 'issuedate',
          text: 'Date Issued',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'violationtype',
          text: 'Violation Type',
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'description',
          text: 'Description',
          filter: constructFilter(textFilter),
          classes: 'table-column--description',
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'violationcategory',
          text: 'Status',
          filter: baseTableConfig.filterPrototypes['DOB_VIOLATION_ACTIVE'],
          headerClasses: 'hide-filter',
          formatter: dobViolationStatusFormatter,
          sort: true,
        }),
      ]
      break
    case 'DOB_COMPLAINT':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'DOB_COMPLAINT', 'complaintnumber'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'complaintnumber',
          text: 'Complaint #',
        }),
        constructStandardColumn({
          dataField: 'dateentered',
          text: 'Date Entered',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'complaintcategory',
          text: 'Category',
          formatter: dobComplaintCategoryFormatter,
          classes: 'table-column--description',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'status',
          text: 'Status',
          formatter: capitalizeFormatter,
          filter: baseTableConfig.filterPrototypes['DOB_COMPLAINT_ACTIVE'],
          headerClasses: 'hide-filters',
          sort: true,
        }),
      ]
      break
    case 'ECB_VIOLATION':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'ECB_VIOLATION', 'ecbviolationnumber'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'ecbviolationnumber',
          text: 'Violation #',
        }),
        constructStandardColumn({
          dataField: 'issuedate',
          text: 'Date Issued',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'violationtype',
          text: 'Violation Type',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'severity',
          text: 'Severity',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'penalityimposed',
          text: 'Penalty Imposed',
          formatter: dollarFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'sectionlawdescription1',
          text: 'Standard Description',
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'violationdescription',
          text: 'Violation Description',
          filter: constructFilter(textFilter),
          classes: 'table-column--description',
        }),
        constructStandardColumn({
          dataField: 'ecbviolationstatus',
          text: 'Status',
          filter: baseTableConfig.filterPrototypes['ECB_VIOLATION_ACTIVE'],
          headerClasses: 'hide-filter',
          sort: true,
          formatter: capitalizeFormatter,
        }),
      ]
      break
    case 'DOB_ISSUED_PERMIT':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'DOB_ISSUED_PERMIT', 'jobfilingnumber'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'key',
          text: 'Key',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'jobfilingnumber',
          text: 'Job Filing #',
        }),
        constructStandardColumn({
          dataField: 'workpermit',
          text: 'Work Permit',
        }),
        constructStandardColumn({
          dataField: 'issuedate',
          text: 'Date Issued',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'worktype',
          text: 'Work Type',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'jobdescription',
          text: 'Description',
          filter: baseTableConfig.filterPrototypes['DOB_ISSUED_PERMIT_TYPE'],
          headerClasses: 'hide-filter',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'type',
          text: 'Source',
          formatter: dobPermitSourceFormatter,
          sort: true,
        }),
      ]
      break
    case 'DOB_FILED_PERMIT':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'DOB_FILED_PERMIT', 'jobfilingnumber'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'key',
          text: 'KEY',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'jobfilingnumber',
          text: 'Job Filing #',
        }),
        constructStandardColumn({
          dataField: 'datefiled',
          text: 'Date Filed',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'jobtype',
          text: 'Job Type',
          filter: baseTableConfig.filterPrototypes['DOB_FILED_PERMIT_TYPE'],
          headerClasses: 'hide-filter',
          sort: true,
          // formatter: dobPermitWorkTypeFormatter,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'jobdescription',
          text: 'Description',
          classes: 'table-column--description',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'jobstatus',
          text: 'Status',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'type',
          text: 'Source',
          formatter: dobPermitSourceFormatter,
          sort: true,
        }),
      ]
      break
    case 'HOUSING_LITIGATION':
      columns = [
        constructStandardColumn({
          dataField: 'litigationid',
          text: 'Litigation ID',
        }),
        constructStandardColumn({
          dataField: 'caseopendate',
          text: 'Date Open',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'casetype',
          text: 'Case Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'openjudgement',
          text: 'Open Judgement?',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'penalty',
          text: 'Penalty',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'casestatus',
          text: 'Status',
          filter: constructFilter(textFilter),
          sort: true,
          formatter: capitalizeFormatter,
        }),
      ]
      break
    case 'ACRIS_REAL_MASTER':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'View Record',
          formatter: (cell, row, index) => linkFormatter(cell, row, index, 'ACRIS_REAL_MASTER', 'documentid'),
          csvExport: false,
        }),
        constructStandardColumn({
          dataField: 'documentid',
          text: 'Document ID',
        }),
        constructStandardColumn({
          dataField: 'docdate',
          text: 'Date',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'doctype',
          text: 'Document Type',
          formatter: acrisDocTypeFormatter,
          csvFormatter: acrisDocTypeFormatter,
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'docamount',
          text: 'Amount',
          formatter: dollarFormatter,
          csvFormatter: annotatedColumnFormatter,

          sort: true,
        }),
        constructNestedTableColumn({
          csvExport: false,
          columnEvent: expandNestedColumnEvent,
          dataField: 'acrisrealparties',
          text: 'View Parties',
          formatter: expandTableFormatter,
          dataKey: 'acrisrealparties',
          classes: 'nested-table-column',
          tableConfig: new TableConfig({ resourceConstant: 'ACRIS_REAL_PARTY' }),
        }),
      ]
      break
    case 'ACRIS_REAL_PARTY':
      columns = [
        constructStandardColumn({
          dataField: 'key',
          text: 'Key',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'documentid',
          text: 'Document ID',
        }),
        constructStandardColumn({
          dataField: 'partytype',
          text: 'Party Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'name',
          text: 'Name',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'address1',
          text: 'Address 1',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'address2',
          text: 'Address 2',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'city',
          text: 'City',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'state',
          text: 'State',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'zip',
          text: 'Zip',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'country',
          text: 'Country',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'EVICTION':
      columns = [
        constructStandardColumn({
          dataField: 'courtindexnumber',
          text: 'Court Index #',
        }),
        constructStandardColumn({
          dataField: 'docketnumber',
          text: 'Docket #',
        }),
        constructStandardColumn({
          dataField: 'executeddate',
          text: 'Date',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'evictionaddress',
          text: 'Address',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'LISPENDEN':
      columns = [
        constructStandardColumn({
          dataField: 'key',
          text: 'Key',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'fileddate',
          text: 'Date Filed',
          formatter: dateFormatter,
          csvFormatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'cr',
          text: 'Creditor',
          formatter: lispendenCleanupFormatter,
          sort: true,
        }),
        constructStandardColumn({
          columnEvent: expandColumnEvent,
          dataField: 'debtor',
          text: 'Debtor',
          formatter: lispendenCleanupFormatter,
          sort: true,
        }),
      ]
      break
    default:
      columns = [{ dataField: 'id', text: 'ID' }]
  }

  return columns
}