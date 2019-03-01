import axios from 'axios'
import { handleCatchError, handleActionDispatch } from 'shared/utilities/actionUtils'
import { handleCompletedRequest } from 'Store/Loading/actions'

export const Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: { 'Content-type': 'application/json' },
})

export const constructAxiosGet = (dispatch, getState, url, params, access_token, constant, handleAction) => {
  const requestId = Math.floor(Math.random() * 1000000)
  handleActionDispatch(dispatch, constant, requestId)
  return Axios.get(url, {
    params: { format: 'json', ...params },
    headers: typeof access_token === 'string' ? { authorization: `Bearer ${access_token}` } : null,
  })
    .then(response => {
      const requestIsValid = !!getState().loading.requests.filter(request => request.id === requestId).length
      if (requestIsValid) {
        dispatch(handleCompletedRequest(constant, requestId))
        dispatch(handleAction(response, constant))
      }
    })
    .catch(error => {
      handleCatchError(error, constant, dispatch)
    })
}
