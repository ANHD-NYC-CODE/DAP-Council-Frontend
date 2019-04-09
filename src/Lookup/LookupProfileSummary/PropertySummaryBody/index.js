import React from 'react'
import PropTypes from 'prop-types'
import { boroCodeToName, constructAddressString } from 'shared/utilities/languageUtils'
import BaseLink from 'shared/components/BaseLink'
import './style.scss'
import { Card, Row, Col } from 'react-bootstrap'

const getSubsidiesText = props => {
  if (props.profile.subsidyrecords.length) {
    return props.profile.subsidyrecords.map(record => record.programname).join(' ')
  } else {
    return [
      props.profile.subsidyj51records.length ? 'J-51 Tax Incentive' : undefined,
      props.profile.subsidy421arecords.length ? '421a Tax Incentive Program' : '',
    ].filter(sp => sp)
  }
}

const PropertySummaryBody = props => {
  return (
    <Row className="property-summary-body property-section">
      <Col xs={12}>
        <Row>
          <Col>
            <Row>
              <Col>
                <h6 className="font-weight-bold text-muted">Primary property address</h6>
              </Col>
            </Row>
            <h5>
              {constructAddressString({
                street: props.profile.address,
                borough: boroCodeToName(props.profile.borough),
                zip: props.profile.zipcode,
              })}
            </h5>
          </Col>
        </Row>
        <hr />
      </Col>
      <Col xs={12}>
        <BaseLink
          href={`https://whoownswhat.justfix.nyc/bbl/${props.profile.bbl}`}
          text='View ownership at "Who Owns What?'
        />
      </Col>
      <Col xs={6}>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">BBL: </label>
          <span className="profile-summary-body__value">{props.profile.bbl}</span>
        </Card.Text>
        <Card.Text className="lookup-profile__geography-link">
          <label className="profile-summary-body__label">Year Built: </label>
          <span className="profile-summary-body__value">{props.profile.yearbuilt}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">Zoning: </label>
          <span className="profile-summary-body__value">{props.profile.zonedist1}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">Rent Programs: </label>
          <span className="profile-summary-body__value">{getSubsidiesText(props)}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">NYCHA? </label>
          <span className="profile-summary-body__value">{props.profile.nycha.length ? 'Yes' : 'No'}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">CONH? </label>
          <span className="profile-summary-body__value">
            {(props.profile.conh_records || {}).length ? 'Yes' : 'No'}
          </span>
        </Card.Text>
      </Col>
      <Col xs={6}>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">Total Units: </label>
          <span className="profile-summary-body__value">{props.profile.unitstotal || 0}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">Residential Units: </label>
          <span className="profile-summary-body__value">{props.profile.unitsres || 0}</span>
        </Card.Text>
        <Card.Text className="lookup-profile-summary__group">
          <label className="profile-summary-body__label">
            Tax Lien? ({(props.config.datasets.find(ds => ds.model_name === 'TaxLien') || {}).version}):{' '}
          </label>
          <span className="profile-summary-body__value">{props.profile.taxliens.length ? 'Yes' : 'No'}</span>
        </Card.Text>
      </Col>
    </Row>
  )
}

PropertySummaryBody.propTypes = {
  profile: PropTypes.object,
  showGeographyLinks: PropTypes.bool,
}

export default PropertySummaryBody
