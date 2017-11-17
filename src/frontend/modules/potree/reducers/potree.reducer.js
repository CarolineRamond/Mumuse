import { combineReducers } from 'redux'

const potreeReducer = (state = {}, action) => {
  switch (action.type) {
    case "POTREE_REQUEST_CAMERAS_PARAMETERS": {
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
      break;
    }
    case "POTREE_RECEIVE_CAMERAS_PARAMETERS": {
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.data,
        lastUpdated: action.receivedAt
      })
      break;
    }
    default:
      return state;
  }
}

export default potreeReducer;