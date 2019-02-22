import React from 'react'
import PropTypes from 'prop-types'
import { setSearchTimeout, queryBuildingAddress } from 'Store/Search/actions'
import { requestWithAuth } from 'shared/utilities/authUtils'

import './style.scss'

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.dispatchQuery = this.dispatchQuery.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedResult) {
      this.props.setSearchValue(
        `${nextProps.selectedResult.housenumber} ${nextProps.selectedResult.street}, ${
          nextProps.selectedResult.boroughName
        }`
      )
    }
  }

  onFormSubmit(e) {
    e.preventDefault()
    this.props.dispatchSelectedBuildingResult()
  }

  dispatchQuery(value) {
    this.props.dispatch(requestWithAuth(queryBuildingAddress(value)))
  }

  onInputChange(event) {
    this.props.clearSelectedSearch()

    this.props.setSearchValue(event.target.value)
    clearTimeout(this.props.searchTimeout)
    if (event.target.value) {
      this.props.dispatch(setSearchTimeout(setTimeout(this.dispatchQuery, 250, event.target.value)))
    }
  }

  render() {
    return (
      <div className="search-bar">
        <form autoComplete="off" className="search-form" onSubmit={this.onFormSubmit}>
          <input
            tabIndex={0}
            placeholder="Type an address to search"
            type="text"
            onChange={this.onInputChange}
            value={this.props.searchValue}
          />
        </form>
      </div>
    )
  }
}

SearchBar.propTypes = {
  clearSelectedSearch: PropTypes.func,
  dispatch: PropTypes.func,
  searchTimeout: PropTypes.number,
  selectBuildingResult: PropTypes.func,
  selectedResult: PropTypes.object,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
}