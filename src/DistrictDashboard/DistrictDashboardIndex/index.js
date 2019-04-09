import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'
import GeographySelect from 'shared/components/GeographySelect'
import LeafletMap from 'LeafletMap'
import ConfigContext from 'Config/ConfigContext'
import IntroductionBlock from 'shared/components/IntroductionBlock'
import { Element } from 'react-scroll'
import * as c from 'shared/constants'
const DistrictDashboardIndex = props => {
  return (
    <div className="alert-map-index">
      <Row>
        <Col className="layout__left-column touch-left padding-xs-sm-0" xs={12} lg={c.SIDEBAR_COLUMN_SIZE}>
          <IntroductionBlock scrollToControls={props.scrollToControls} />
        </Col>
        <Col className="px-md-4 py-3 py-lg-6" xs={12} lg={12 - c.SIDEBAR_COLUMN_SIZE}>
          <Element name="main-controls" />
          <Row className="mb-4">
            <Col>
              <h5 className="text-uppercase text-muted font-weight-bold">Select a district to begin.</h5>
              <GeographySelect
                currentGeographyType={props.appState.currentGeographyType}
                currentGeographyId={props.appState.currentGeographyId}
                dispatch={props.dispatch}
                changing={props.appState.changingGeography}
                changingGeographyType={props.appState.changingGeographyType}
                changingGeographyId={props.appState.changingGeographyId}
                cancelChangeGeography={props.cancelChangeGeography}
                handleChangeGeographyType={props.handleChangeGeographyType}
                handleChangeGeography={props.handleChangeGeography}
                showSubmit={
                  props.appState.changingGeography &&
                  props.appState.changingGeographyType &&
                  props.appState.changingGeographyId > 0
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ConfigContext.Consumer>
                {config => {
                  return (
                    <LeafletMap
                      appState={props.appState}
                      currentGeographyType={props.appState.changingGeographyType}
                      councilDistricts={config.councilDistricts}
                      communityDistricts={config.communityDistricts}
                      handleChangeGeography={props.handleChangeGeography}
                      handleChangeGeographyId={props.handleChangeGeographyId}
                      selectGeographyData={config.selectGeographyData}
                    />
                  )
                }}
              </ConfigContext.Consumer>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

DistrictDashboardIndex.propTypes = {
  changeGeographyAndId: PropTypes.func,
  dispatch: PropTypes.func,
}

export default DistrictDashboardIndex
