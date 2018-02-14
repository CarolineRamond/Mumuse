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
    filter: ['==', '_isShown', true],
    paint: {
        'fill-outline-color': '#22a37a ',
        'fill-color': '#22a37a ',
        'fill-opacity': 0.6
    },
    metadata: {
        priority: 4000,
        name: 'Pointcloud',
        isShown: true
    }
};

// Reducer for pointclouds layer
// (pointwise pointclouds representation, originated from geojson source)
export const pointCloudsLayerReducer = (state = pointCloudsLayerInitialState, action) => {
    switch (action.type) {
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
                        didChange: { layout: layoutChange }
                    }
                };
            }
            return defaultLayerReducer(state);
        }
        default:
            return defaultLayerReducer(state);
    }
};

export default combineReducers({
    'pointClouds-layer': pointCloudsLayerReducer
});
