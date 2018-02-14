import { combineReducers } from 'redux';
import extent from 'turf-extent';

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
        initSelectedPending: null
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
                        _isShown: true,
                        _isInBounds: true,
                        _isSelected: feature.properties._id === state.metadata.initSelectedPending
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
                    didChange: true,
                    initSelectedPending: undefined
                }
            };
        }
        case 'POINTCLOUD_INIT_SELECTED': {
            if (state.data.features.length > 0) {
                // pointcloud features were already loaded :
                // simply add property _isSelected to required pointcloud feature
                const newFeatures = state.data.features.map(feature => {
                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            _isSelected: feature.properties._id === action.payload.pointCloudId
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
            } else {
                // pointcloud features were not loaded : populate metadata.initSelectedPending
                return {
                    ...state,
                    metadata: {
                        ...state.metadata,
                        initSelectedPending: action.payload.pointCloudId
                    }
                };
            }
        }
        case 'POINTCLOUD_SELECT_BY_ID': {
            const newFeatures = state.data.features.map(feature => {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        _isSelected: feature.properties._id === action.payload.pointCloudId
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
                const bounds = extent(feature);
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        _isInBounds: _boundsIntersect(bounds, mapBounds)
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
        default:
            return defaultSourceReducer(state);
    }
};

export default combineReducers({
    'pointClouds-source': pointCloudsSourceReducer
});
