import { createSelector } from 'reselect'

export const getRequestByConstant = (requests, constant) => {
  return requests.filter(request => request.requestConstant === constant)
}

export const getRequestType = (requests, type) => {
  return requests.filter(request => request.type === type)
}

export const getDefaultRequest = requests => {
  return requests.find(request => request.type === 'GEOGRAPHY_HOUSING_TYPE')
}

export const getDefaultResultsFilter = model => {
  return model.ownResultFilters.find(f => f.id === 'HOUSING_TYPE_RESIDENTIAL')
}

export const getManyRequestTypes = (requests = [], types = []) => {
  return requests.filter(request => types.some(type => type === request.type))
}

export const selectRequests = state => {
  return state.appState.requests
}

export const makeSelectRequests = createSelector(
  selectRequests,
  requests => {
    return requests
  }
)
