import { constructAxiosGet } from 'shared/utilities/Axios'
import * as u from 'shared/constants/urls'
import * as c from '../constants'

export const handleGetBuilding = (response, key = null) => ({
  type: c.HANDLE_GET_BUILDING,
  data: response.data,
})

export const handleGetBuildingResource = (response, key = null) => ({
  type: c.HANDLE_GET_BUILDING_RESOURCE,
  key: key,
  data: response.data,
})

export const getBuilding = id => (dispatch, getState, access_token) => {
  return constructAxiosGet(
    dispatch,
    getState,
    `${u.BUILDING_URL}${id}`,
    null,
    access_token,
    c.GET_BUILDING,
    handleGetBuilding
  )
}

export const getBuildingResource = (dataset, id, params = null, actionKey) => (dispatch, getState, access_token) => {
  return constructAxiosGet(
    dispatch,
    getState,
    `${u.BUILDING_URL}${id}${dataset.url}`,
    null,
    access_token,
    actionKey,
    handleGetBuildingResource
  )
}
