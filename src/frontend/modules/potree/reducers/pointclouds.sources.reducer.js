import { combineReducers } from 'redux';
const baseUrl =
    window.location.origin !== 'null' ? window.location.origin : 'http://localhost:8080';

export const defaultSourceReducer = state => {
    return {
        ...state,
        metadata: {
            ...state.metadata,
            didChange: false
        }
    };
};

export const pointCloudsSourceInitialState = {
    type: 'geojson',
    data: `${baseUrl}/potreeviewer/potreedataset`,
    metadata: {
        didChange: false,
        selectFilterPending: false,
        stillFiltered: []
    }
};

export const pointCloudsSourceReducer = (state = pointCloudsSourceInitialState, action) => {
    switch (action.type) {
        case 'LOGOUT_FULFILLED':
        case 'FETCH_USER_FULFILLED':
        case 'LOGIN_FULFILLED':
        case 'POINTCLOUDS_UPLOAD_FULFILLED':
        case 'POINTCLOUDS_DELETE_FULFILLED':
        case 'POINTCLOUDS_MAP_END_DRAG_FULFILLED': {
            return defaultSourceReducer(state);
        }
        default:
            return defaultSourceReducer(state);
    }
};

export default combineReducers({
    'pointClouds-source': pointCloudsSourceReducer
});
