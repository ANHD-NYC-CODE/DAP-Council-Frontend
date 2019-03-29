import React from 'react'
import PropTypes from 'prop-types'
import { setMapFilterDate } from 'Store/AppState/actions'

import { getRequestType, getManyRequestTypes, getRequestByConstant } from 'Store/AppState/selectors'

import { requestWithAuth } from 'shared/utilities/authUtils'
import { makeRequest } from 'Store/Request/actions'

import AlertMapShow from 'AlertMap/AlertMapShow'
import InnerLoader from 'shared/components/Loaders/InnerLoader'

class AlertMapRequestsWrapper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.toggleDateRange = this.toggleDateRange.bind(this)

    this.loadRequests = this.loadRequests.bind(this)
    this.switchSelectedRequest = this.switchSelectedRequest.bind(this)
    this.state = {
      selectedRequestIndex: this.props.requests.indexOf(this.getInitialRequest()),
    }
  }

  componentDidMount() {
    if (this.props.requests.length) {
      this.loadRequests(this.props.requests)
    }
  }

  componentDidUpdate() {
    const uncalledRequests = this.props.requests.filter(r => !r.called)
    if (uncalledRequests.length) {
      this.loadRequests(uncalledRequests)
    }
  }

  getInitialRequest() {
    return getRequestType(this.props.requests, 'ADVANCED_SEARCH').length
      ? getRequestType(this.props.requests, 'ADVANCED_SEARCH')[0]
      : getRequestType(this.props.requests, 'MAP_FILTER')[0]
  }

  loadRequests(requests = []) {
    requests.forEach(request => {
      this.props.dispatch(requestWithAuth(makeRequest(request)))
    })

    this.setState({
      selectedRequestIndex: this.props.requests.indexOf(this.getInitialRequest()),
    })
  }

  toggleDateRange(value) {
    this.props.dispatch(setMapFilterDate(value))

    const mapRequests = getRequestType(this.props.requests, 'MAP_FILTER')
    mapRequests.forEach(request => {
      request.called = false
      request.paramMaps
        .filter(p => p.type === 'DATE')
        .forEach(paramMap => {
          paramMap.value = value
        })
    })

    this.loadRequests(mapRequests)
  }

  switchSelectedRequest(index) {
    this.setState({
      selectedRequestIndex: index,
    })
  }

  render() {
    return this.props.requests.length ? (
      <AlertMapShow
        geographyRequests={getManyRequestTypes(this.props.requests, ['MAP_FILTER', 'ADVANCED_SEARCH'])}
        housingTypeRequests={getRequestType(this.props.requests, 'GEOGRAPHY_HOUSING_TYPE')}
        propertySummaryRequest={getRequestByConstant(this.props.requests, 'GEOGRAPHY_HOUSING_TYPE_ALL')[0]}
        toggleDateRange={this.toggleDateRange}
        selectedRequestIndex={this.state.selectedRequestIndex}
        switchSelectedRequest={this.switchSelectedRequest}
        {...this.props}
      />
    ) : (
      <InnerLoader />
    )
  }
}

AlertMapRequestsWrapper.propTypes = {
  appState: PropTypes.object,
  mapFilterDate: PropTypes.string,
  requests: PropTypes.array,
}

export default AlertMapRequestsWrapper
