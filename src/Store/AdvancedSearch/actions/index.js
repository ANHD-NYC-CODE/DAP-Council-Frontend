import { constructAxiosGet } from 'shared/utilities/Axios'
import * as c from '../constants'
import * as u from 'shared/constants/urls'

import { convertConditionMappingToQ } from 'AdvancedSearch/utilities/advancedSearchUtils'

export const addNewCondition = (parentKey, conditionKey) => {
  return {
    type: c.ADD_NEW_CONDITION,
    parentKey,
    conditionKey,
  }
}

export const removeCondition = conditionKey => ({
  type: c.REMOVE_CONDITION,
  conditionKey,
})

export const addFilter = (conditionKey, filter) => ({
  type: c.ADD_FILTER,
  filter: filter,
  conditionKey,
})

export const updateFilter = (conditionKey, filterIndex, newFilter) => ({
  type: c.UPDATE_FILTER,
  conditionKey,
  filterIndex,
  newFilter,
})

export const removeFilter = (conditionKey, filterIndex) => ({
  type: c.REMOVE_FILTER,
  conditionKey,
  filterIndex,
})

export const handleGetAdvancedSearch = response => ({
  type: c.HANDLE_GET_ADVANCED_SEARCH,
  data: response.data,
})

export const getAdvancedSearch = conditions => (dispatch, getState, access_token) => {
  const requestId = Math.floor(Math.random() * 1000000)
  return constructAxiosGet(
    dispatch,
    getState,
    requestId,
    `${u.PROPERTY_URL}`,
    { q: convertConditionMappingToQ(conditions) },
    access_token,
    c.GET_ADVANCED_SEARCH,
    handleGetAdvancedSearch
  )
}
