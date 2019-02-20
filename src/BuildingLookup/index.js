import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMatchSelector } from 'connected-react-router'
import * as a from 'Store/Building/actions'
import { requestWithAuth } from 'shared/utilities/authUtils'
import { createLoadingSelector } from 'Store/Loading/selectors'
import { createErrorSelector } from 'Store/Error/selectors'
import * as c from 'Store/Building/constants'
import Layout from 'Layout'
import LeafletMap from 'LeafletMap'
import BuildingSearchModule from '../BuildingSearchModule'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import BuildingHistoryTable from 'BuildingLookup/BuildingHistoryTable'

class BuildingLookup extends React.Component {
  constructor(props) {
    super(props)

    this.getBuildingById = this.getBuildingById.bind(this)

    if (props.id && !props.loading) {
      this.getBuildingById(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id && !nextProps.loading) {
      this.getBuildingById(nextProps)
    }
  }

  getBuildingById(props) {
    if (!(props.building || {}).currentBuilding || props.building.currentBuilding.bin !== props.id) {
      props.dispatch(requestWithAuth(a.getBuilding(props.id)))
    }
  }

  render() {
    return (
      <Layout>
        <h1>Building Lookup</h1>

        <Row>
          <Col sm={12} md={4}>
            <BuildingSearchModule />
            <LeafletMap />
          </Col>
          <Col sm={12} md={8}>
            <h2>Building Info</h2>
            <Jumbotron style={{ maxHeight: '500px' }}>
              {this.props.loading ? <div>Loading</div> : JSON.stringify(this.props.building.currentBuilding, null, 2)}
            </Jumbotron>
            <h2>Building History</h2>
            <BuildingHistoryTable
              getRecordsConstant={c.GET_BUILDING_HPD_VIOLATIONS}
              parentId={this.props.id}
              recordsKey="hpdViolations"
              title="HPD Violations"
            />
            <BuildingHistoryTable
              getRecordsConstant={c.GET_BUILDING_DOB_VIOLATIONS}
              parentId={this.props.id}
              recordsKey="dobViolations"
              title="DOB Violations"
            />
          </Col>
        </Row>
      </Layout>
    )
  }
}

BuildingLookup.propTypes = {
  dispatch: PropTypes.func,
  id: PropTypes.string,
}

const loadingSelector = createLoadingSelector([c.GET_BUILDING])
const errorSelector = createErrorSelector([c.GET_BUILDING])

const mapStateToProps = state => {
  const matchSelector = createMatchSelector({ path: '/buildings/:id' })
  const match = matchSelector(state)

  return {
    id: match ? match.params.id : null,
    building: state.building,
    loading: loadingSelector(state),
    error: errorSelector(state),
  }
}

export default connect(mapStateToProps)(BuildingLookup)
