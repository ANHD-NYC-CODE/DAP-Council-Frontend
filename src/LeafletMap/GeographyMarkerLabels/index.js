import React from 'react'
import PropTypes from 'prop-types'
import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import './style.scss'
import { getGeographyObject } from 'shared/utilities/routeUtils'

const GeographyMarkerLabels = props => {
  const geographyObject = getGeographyObject(props.currentGeographyType)
  if (!props.geographies.length) return null
  return props.geographies
    .filter(
      geography =>
        (geographyObject.hidden && !geographyObject.hidden.includes(geography.id)) ||
        (!geographyObject.hidden && geographyObject)
    )
    .map((geography, index) => {
      return (
        <Marker
          key={`geography-label-${index}`}
          interactive={false}
          position={new L.geoJSON(geography.data).getBounds().getCenter()}
          opacity={0}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, 35]}
            className={`geography-marker__tooltip geography-marker__tooltip--${props.currentGeographyType}`}
          >
            <span className="geography-marker-label">{String(geography.data.properties.id)}</span>
          </Tooltip>
        </Marker>
      )
    })
}

GeographyMarkerLabels.defaultProps = {
  geographies: [],
}

GeographyMarkerLabels.propTypes = {
  geographies: PropTypes.array,
  currentGeographyType: PropTypes.string,
}

export default GeographyMarkerLabels
