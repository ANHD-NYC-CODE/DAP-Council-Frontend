import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { boroCodeToName } from 'shared/utilities/languageUtils'

import LeafletMap from 'LeafletMap'
import BaseLink from 'shared/components/BaseLink'

import GoogleMap from 'shared/components/GoogleMap'
import GoogleStreetView from 'shared/components/GoogleStreetView'

import './style.scss'
const LocationSection = props => {
  return (
    <div className="location-section">
      <div className="location-section__map">
        <GoogleStreetView lat={props.lat} lng={props.lng} />
      </div>
      <div className="location-section__map">
        <LeafletMap
          appState={props.appState}
          currentGeographyType={props.appState.currentGeographyType}
          center={[props.lat, props.lng]}
          results={props.propertyResult}
          iconConfig="SINGLE"
          zoom={17}
        />
        {/* <GoogleMap lat={props.lat} lng={props.lng} /> */}
      </div>
      <div className="text-center">
        <BaseLink
          className="text-link"
          href={`https://google.com/maps/place/${props.propertyResult.address}, ${boroCodeToName(
            props.propertyResult.borough
          )} ${props.propertyResult.zipcode}`}
        >
          Open Google Maps
        </BaseLink>
      </div>
    </div>
  )
}

LocationSection.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
  propertyResult: PropTypes.object,
}
LocationSection.defaultProps = {
  lat: '40.7',
  lng: '-74',
}

export default LocationSection