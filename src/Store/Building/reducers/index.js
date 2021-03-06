import * as c from '../constants'

export const initialState = {
  currentBuilding: undefined,
}

export const buildingReducer = (state = Object.freeze(initialState), action = { data: [] }) => {
  switch (action.type) {
    case c.HANDLE_GET_BUILDING: {
      return {
        ...state,
        currentBuilding: action.data,
      }
    }
    case c.HANDLE_GET_BUILDING_RESOURCE: {
      return {
        ...state,
        [action.key]: action.data,
      }
    }
    default:
      return state
  }
}
