import React from 'react'
import PropTypes from 'prop-types'
import SearchResultRow from 'BuildingSearchModule/SearchResultRow'

import './style.scss'
import { Table } from 'react-bootstrap'
const SearchResults = props => {
  return (
    <Table className="search-results" size="sm" bordered hover striped>
      {props.loading && <div className="text-info">loading</div>}
      {props.error && <div className="text-danger">{props.error.message}</div>}
      {props.results.map((result, index) => (
        <SearchResultRow selectBuildingResult={props.selectBuildingResult} key={`result-${index}`} result={result} />
      ))}
    </Table>
  )
}

SearchResults.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  selectBuildingResult: PropTypes.func,
  results: PropTypes.array,
}

export default SearchResults
