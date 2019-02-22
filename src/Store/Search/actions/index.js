import { constructAxiosGet } from 'shared/utilities/Axios'
import { SEARCH_URL } from 'shared/constants/urls'
import * as loadingActions from 'Store/Loading/actions'
import { GET_BUILDING_SEARCH } from 'shared/constants/actions'
export const HANDLE_READ_SEARCH_RESPONSE = 'HANDLE_READ_SEARCH_RESPONSE'
export const CLEAR_SEARCH = 'CLEAR_SEARCH'
export const SET_SEARCH_TIMEOUT = 'SET_SEARCH_TIMEOUT'

export const handleReadSearchResponse = (response, key = null) => {
  let results = response.data
  if (!results.length) {
    results = [{ bin: undefined, housenumber: '', street: 'No results', borough: '' }]
  }

  return {
    type: HANDLE_READ_SEARCH_RESPONSE,
    data: results,
  }
}
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
})

export const setSearchTimeout = event => ({
  type: SET_SEARCH_TIMEOUT,
  data: event,
})

export const queryBuildingAddress = value => (dispatch, access_token) => {
  return constructAxiosGet(
    SEARCH_URL,
    { fts: value },
    access_token,
    dispatch,
    GET_BUILDING_SEARCH,
    handleReadSearchResponse
  )
}
