import { textFilter } from 'react-bootstrap-table2-filter'
import { TableConfig } from 'shared/classes/TableConfig'
import ExpandedLinkRow from 'shared/components/BaseTable/ExpandedLinkRow'
import BaseTable from 'shared/components/BaseTable'
import {
  dateFormatter,
  bldgClassFormater,
  dobComplaintCategoryFormatter,
  dobPermitWorkTypeFormatter,
  acrisDocTypeFormatter,
  dobPermitSourceFormatter,
  expandTableFormatter,
} from 'shared/utilities/tableUtils'

export const getKeyField = constant => {
  switch (constant) {
    case 'PROPERTY':
      return 'bbl'
    case 'BUILDING':
      return 'bin'
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
      return 'id'
    case 'HOUSING_LITIGATION':
      return 'litigationid'
    case 'ACRIS_REAL_MASTER':
      return 'documentid'
    case 'EVICTION':
      return 'courtindexnumber'
    case 'FORECLOSURE':
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
      return 'job'
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

export const getTableColumns = (constant, columnExpandFunction, getLinkProps = () => null, constructFilter) => {
  let columns

  const handleColumnEvent = ({ e, row, component, dataKey, tableConfig } = {}) => {
    const rowKey = getKeyField(constant)

    columnExpandFunction({
      component,
      expandedRowProps: {
        records: row[dataKey],
        tableConfig,
        content: e.target.textContent,
        ...getLinkProps({ linkId: row[getLinkId(constant)], bin: row.bin }),
      },
      rowId: row[rowKey],
      e,
    })
  }

  const constructStandardColumn = ({
    dataField,
    text,
    sort,
    filter,
    classes,
    formatter,
    hidden,
    component = ExpandedLinkRow,
  }) => {
    return {
      dataField,
      text,
      sort,
      filter,
      classes,
      formatter,
      hidden,
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          handleColumnEvent({ e, column, columnIndex, row, rowIndex, component })
        },
        onTouchStart: (e, column, columnIndex, row, rowIndex) => {
          handleColumnEvent({ e, column, columnIndex, row, rowIndex, component })
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
    component = BaseTable,
    dataKey,
    tableConfig,
  }) => {
    return {
      dataField,
      text,
      sort,
      filter,
      classes,
      formatter,
      hidden,
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          handleColumnEvent({ e, column, columnIndex, row, rowIndex, component, dataKey, tableConfig })
        },
        onTouchStart: (e, column, columnIndex, row, rowIndex) => {
          handleColumnEvent({ e, column, columnIndex, row, rowIndex, component, dataKey, tableConfig })
        },
      },
    }
  }

  switch (constant) {
    case 'PROPERTY':
      columns = [
        constructStandardColumn({
          dataField: 'bbl',
          text: 'BBL',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'address',
          text: 'Address',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'bldgclass',
          text: 'Class',
          filter: constructFilter(textFilter),
          formatter: bldgClassFormater,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'zonedist1',
          text: 'Zone 1',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'yearbuilt',
          text: 'Year Built',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'unitstotal',
          text: 'Total Units',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'unitsres',
          text: 'Residential Units',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'unitsrentstabilized',
          text: 'Rent Stabilized Units',
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'numbldgs',
          text: '# Buildings',
          sort: true,
        }),
      ]
      break
    case 'HPD_REGISTRATION':
      columns = [
        constructStandardColumn({
          dataField: 'registrationid',
          text: 'ID',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'registrationenddate',
          text: 'End Date',
          formatter: dateFormatter,
          sort: true,
        }),
        constructNestedTableColumn({
          dataField: 'contacts',
          text: 'View Contacts',
          formatter: expandTableFormatter,
          dataKey: 'contacts',
          classes: 'nested-table-column',
          tableConfig: new TableConfig({ resourceConstant: 'HPD_CONTACT' }),
        }),
      ]
      break
    case 'HPD_VIOLATION':
      columns = [
        constructStandardColumn({
          dataField: 'registrationcontactid',
          text: 'ID',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'violationid',
          text: 'Violation ID',
        }),
        constructStandardColumn({
          dataField: 'approveddate',
          text: 'Date Approved',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'class_name',
          text: 'Class',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'novdescription',
          text: 'Description',
          filter: constructFilter(textFilter),
          classes: 'table-column--description',
        }),
        constructStandardColumn({
          dataField: 'currentstatus',
          text: 'Notice Status',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'violationstatus',
          text: 'Violation Status',
          filter: constructFilter(textFilter),
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
          dataField: 'corporationname',
          text: 'Corp Name',
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
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructNestedTableColumn({
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
          dataField: 'spacetype',
          text: 'Space Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'majorcategory',
          text: 'Major Category',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'minorcategory',
          text: 'Minor Category',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'code',
          text: 'Descriptor',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
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
          dataField: 'isndobbisviol',
          text: 'isndobbisviol',
        }),
        constructStandardColumn({
          dataField: 'issuedate',
          text: 'Date Issued',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'violationtype',
          text: 'Violation Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'description',
          text: 'Description',
          classes: 'table-column--description',
          filter: constructFilter(textFilter),
        }),
        constructStandardColumn({
          dataField: 'violationcategory',
          text: 'Status',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'DOB_COMPLAINT':
      columns = [
        constructStandardColumn({
          dataField: 'complaintnumber',
          text: 'Complaint #',
        }),
        constructStandardColumn({
          dataField: 'dateentered',
          text: 'Date Entered',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
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
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'ECB_VIOLATION':
      columns = [
        constructStandardColumn({
          dataField: 'ecbviolationnumber',
          text: 'Violation #',
        }),
        constructStandardColumn({
          dataField: 'issuedate',
          text: 'Date Issued',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'violationtype',
          text: 'Violation Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'severity',
          text: 'Severity',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'violationdescription',
          text: 'Description',
          classes: 'table-column--description',
          filter: constructFilter(textFilter),
        }),
        constructStandardColumn({
          dataField: 'ecbviolationstatus',
          text: 'Status',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'DOB_ISSUED_PERMIT':
      columns = [
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
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'worktype',
          text: 'Work Type',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'jobdescription',
          text: 'Description',
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
    case 'DOB_FILED_PERMIT':
      columns = [
        constructStandardColumn({
          dataField: 'id',
          text: 'ID',
          hidden: true,
        }),
        constructStandardColumn({
          dataField: 'job',
          text: 'Job #',
        }),
        constructStandardColumn({
          dataField: 'prefilingdate',
          text: 'Date Filed',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'jobtype',
          text: 'Job Type',
          formatter: dobPermitWorkTypeFormatter,
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'jobdescription',
          text: 'Description',
          classes: 'table-column--description',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'jobstatusdescrp',
          text: 'Status',
          filter: constructFilter(textFilter),
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
        }),
      ]
      break
    case 'ACRIS_REAL_MASTER':
      columns = [
        constructStandardColumn({
          dataField: 'documentid',
          text: 'Document ID',
        }),
        constructStandardColumn({
          dataField: 'docdate',
          text: 'Date',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'doctype',
          text: 'Document Type',
          formatter: acrisDocTypeFormatter,
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'docamount',
          text: 'Amount',
          sort: true,
        }),
        constructNestedTableColumn({
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
          dataField: 'name',
          text: 'Name',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'address1',
          text: 'Address 1',
          filter: constructFilter(textFilter),
          sort: true,
        }),
        constructStandardColumn({
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
          text: 'Docker #',
        }),
        constructStandardColumn({
          dataField: 'executeddate',
          text: 'Date',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'evictionaddress',
          text: 'Address Description',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    case 'FORECLOSURE':
      columns = [
        constructStandardColumn({
          dataField: 'key',
          text: 'Key',
        }),
        constructStandardColumn({
          dataField: 'fileddate',
          text: 'Date Filed',
          formatter: dateFormatter,
          sort: true,
        }),
        constructStandardColumn({
          dataField: 'debtor',
          text: 'Debtor',
          filter: constructFilter(textFilter),
          sort: true,
        }),
      ]
      break
    default:
      columns = [{ dataField: 'id', text: 'ID' }]
  }

  return columns
}
