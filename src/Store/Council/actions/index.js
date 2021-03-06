import { constructAxiosGet } from 'shared/utilities/Axios'
import * as u from 'shared/constants/urls'
import {
  COUNCIL_DISTRICTS_INDEX,
  getStorageDataAction,
  setIndexedDataThenUpdateReducer,
  delCouncilDistrictsData,
} from 'shared/utilities/storageUtils'

import * as c from '../constants'
import { constructSimplePropertyParams } from 'shared/utilities/actionUtils'

const getCouncilsActionObject = response => ({
  type: c.HANDLE_GET_COUNCILS,
  data: response.data,
})

export const handleGetCouncils = (response, _, setStorage = true) => {
  if (setStorage) {
    delCouncilDistrictsData().then(() => {
      setIndexedDataThenUpdateReducer(COUNCIL_DISTRICTS_INDEX, response)
    })
  }
  return getCouncilsActionObject(response)
}

export const handleGetCouncil = (response) => ({
  type: c.HANDLE_GET_COUNCIL,
  data: response.data,
})

export const handleGetCouncilHousing = (response) => ({
  type: c.HANDLE_GET_COUNCIL_HOUSING,
  data: response.data,
})

export const handleGetCouncilPropertySummary = (response, key = null) => ({
  type: c.HANDLE_GET_COUNCIL_PROPERTY_SUMMARY,
  data: response.data,
  key,
})

export const getCouncils = () => (dispatch, getState, access_token) => {
  const requestId = Math.floor(Math.random() * 1000000)

  return getStorageDataAction(dispatch, c.GET_COUNCILS, requestId, COUNCIL_DISTRICTS_INDEX, handleGetCouncils)
    .then(storageData => {
      // TODO: Temporary - reset the DBs
      if (!storageData) {
        return councilsAxios(dispatch, getState, access_token, requestId)
      }
    })
    .catch(() => councilsAxios(dispatch, getState, access_token, requestId))
}

const councilsAxios = (dispatch, getState, access_token, requestId) => {
  return constructAxiosGet(
    dispatch,
    getState,
    requestId,
    u.COUNCIL_URL,
    null,
    access_token,
    c.GET_COUNCILS,
    handleGetCouncils
  )
}

export const getCouncil = id => (dispatch, getState, access_token) => {
  const requestId = Math.floor(Math.random() * 1000000)

  return constructAxiosGet(
    dispatch,
    getState,
    requestId,
    `${u.COUNCIL_URL}${id}/`,
    null,
    access_token,
    c.GET_COUNCIL,
    handleGetCouncil
  )
}

export const getCouncilHousing = (id, params) => (dispatch, getState, access_token) => {
  const requestId = Math.floor(Math.random() * 1000000)

  return constructAxiosGet(
    dispatch,
    getState,
    requestId,
    `${u.COUNCIL_URL}${id}/housing`,
    params,
    access_token,
    c.GET_COUNCIL_HOUSING,
    handleGetCouncilHousing
  )
}

export const getCouncilPropertySummary = (dataset, id, params, actionKey) => (dispatch, getState, access_token) => {
  const requestId = Math.floor(Math.random() * 1000000)

  return constructAxiosGet(
    dispatch,
    getState,
    requestId,
    `${u.COUNCIL_URL}${id}${u.PROPERTY_URL}`,
    constructSimplePropertyParams(params),
    access_token,
    actionKey,
    handleGetCouncilPropertySummary
  )
}
