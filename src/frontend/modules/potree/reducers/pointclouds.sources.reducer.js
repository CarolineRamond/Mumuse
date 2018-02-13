import { combineReducers } from 'redux';
const baseUrl =
    window.location.origin !== 'null' ? window.location.origin : 'http://localhost:8080';

const _boundsIntersect = (boundsA, boundsB) => {
    const intersectLng = !(boundsA[2] < boundsB[0] || boundsA[0] > boundsB[2]);
    const intersectLat = !(boundsA[3] < boundsB[1] || boundsA[1] > boundsB[3]);
    return intersectLng && intersectLat;
};

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
    data: {
        type: 'FeatureCollection',
        features: []
    },
    metadata: {
        didChange: false,
        selectFilterPending: false,
        stillFiltered: []
    }
};

export const pointCloudsSourceReducer = (state = pointCloudsSourceInitialState, action) => {
    switch (action.type) {
        case 'POINTCLOUD_FETCH_FULFILLED': {
            const newFeatures = action.payload.data.features.map(feature => {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        _isShown: true
                    }
                };
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    features: newFeatures
                },
                metadata: {
                    ...state.metadata,
                    didChange: true
                }
            };
        }
        case 'POINTCLOUD_TOGGLE': {
            const newFeatures = state.data.features.map(feature => {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        _isShown:
                            feature.properties._id === action.payload.pointCloudId
                                ? !feature.properties._isShown
                                : feature.properties._isShown
                    }
                };
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    features: newFeatures
                },
                metadata: {
                    ...state.metadata,
                    didChange: true
                }
            };
        }
        case 'UPDATE_WORLD_STATE': {
            const mapBounds = action.payload.bounds;
            const newFeatures = state.data.features.map(feature => {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        // _isInBounds: _boundsIntersect(feature.properties.bounds, mapBounds)
                        _isInBounds: true
                    }
                };
            });
            return {
                ...state,
                data: {
                    ...state.data,
                    features: newFeatures
                }
            };
        }
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
