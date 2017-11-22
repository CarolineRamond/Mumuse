import { combineReducers } from "redux";

const defaultSourceReducer = (state) => {
  return Object.assign({}, state, { 
    metadata: Object.assign({}, state.metadata, {
      didChange: undefined 
    })
  });
}

const pointCloudsSourceReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGOUT_FULFILLED':
    case 'FETCH_USER_FULFILLED':
    case 'LOGIN_FULFILLED':
    case 'POINTCLOUDS_UPLOAD_FULFILLED':
    case 'POINTCLOUDS_DELETE_FULFILLED':
    case "POINTCLOUDS_MAP_END_DRAG_FULFILLED": {
      // return Object.assign({}, state, {
      //   metadata: Object.assign({}, state.metadata, {
      //     didChange: true
      //   })
      // });
      // break;
    }
    default:
      return defaultSourceReducer(state);
  }
}

export default combineReducers({
  'pointClouds-source': pointCloudsSourceReducer
});