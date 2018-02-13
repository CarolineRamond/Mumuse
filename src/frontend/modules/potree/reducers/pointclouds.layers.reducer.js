import { combineReducers } from 'redux';

export const defaultLayerReducer = state => {
    return {
        ...state,
        metadata: {
            ...state.metadata,
            didChange: undefined
        }
    };
};

export const pointCloudsLayerInitialState = {
    id: 'pointClouds-layer',
    type: 'fill',
    source: 'pointClouds-source',
    layout: {
        visibility: 'visible'
    },
    filter: ['all', ['!in', '_id']],
    paint: {
        'fill-outline-color': '#22a37a ',
        'fill-color': '#22a37a ',
        'fill-opacity': 0.6
    },
    metadata: {
        priority: 4000,
        name: 'Pointcloud',
        isLocked: false,
        isShown: true,
        wasShownBeforeLock: true
    }
};

// Reducer for pointclouds layer
// (pointwise pointclouds representation, originated from geojson source)
export const pointCloudsLayerReducer = (state = pointCloudsLayerInitialState, action) => {
    switch (action.type) {
        case 'POINTCLOUD_INIT_SELECTED_FULFILLED': {
            return defaultLayerReducer(state);
        }
        case 'POINTCLOUD_CLICK': {
            return {
                ...state,
                metadata: {
                    ...state.metadata,
                    didChange: {}
                }
            };
        }
        case 'TOGGLE_LAYER': {
            if (action.payload.layerId === state.id) {
                const layoutChange = {
                    visibility: state.metadata.isShown ? 'none' : 'visible'
                };
                return {
                    ...state,
                    layout: layoutChange,
                    metadata: {
                        ...state.metadata,
                        isShown: !state.metadata.isShown,
                        wasShownBeforeLock: !state.metadata.isShown,
                        didChange: { layout: layoutChange }
                    }
                };
            }
            return defaultLayerReducer(state);
        }
        case 'POINTCLOUD_TOGGLE':
            const currentFilter = state.filter;
            const filteredIds = currentFilter[1].slice(2, currentFilter[1].length) || [];
            const pointCloudIndex = filteredIds.indexOf(action.payload.pointCloudId);
            if (pointCloudIndex > -1) {
                filteredIds.splice(pointCloudIndex, 1);
            } else {
                filteredIds.push(action.payload.pointCloudId);
            }
            const newFilter = ['all', ['!in', '_id'].concat(filteredIds)];
            return {
                ...state,
                filter: newFilter,
                metadata: {
                    ...state.metadata,
                    didChange: { filter: newFilter }
                }
            };
        case 'POINTCLOUD_UPDATE_FEATURES':
        case 'POINTCLOUD_GRID_UPDATE_FEATURES':
        case 'POINTCLOUD_TIMELINE_UPDATE':
        default:
            return defaultLayerReducer(state);
    }
};

export default combineReducers({
    'pointClouds-layer': pointCloudsLayerReducer
});
