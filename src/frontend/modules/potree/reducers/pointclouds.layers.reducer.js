import { combineReducers } from 'redux';

export const defaultLayerReducer = (state) => {
  return {
    ...state,
    metadata: {
      ...state.metadata,
      didChange: undefined
    }
  }
}

export const pointCloudsLayerInitialState = {
  id: "pointClouds-layer",
  type: "fill",
  source: "pointClouds-source",
  layout: {
      visibility: "visible"
  },
  paint: {
      'fill-outline-color': '#22a37a ',
      'fill-color': '#22a37a ',
      'fill-opacity': 0.6
  },
  metadata: {
      name: "Pointcloud",
      isLocked: false,
      isShown: true,
      wasShownBeforeLock: true
  }
};


// Reducer for pointclouds layer
// (pointwise pointclouds representation, originated from geojson source)
export const pointCloudsLayerReducer = (state = pointCloudsLayerInitialState, action) => {
  switch (action.type) {
    case "POINTCLOUDS_INIT_SELECTED_FULFILLED": {
    }
    case "POINTCLOUDS_CLICK": {
      return {
        ...state,
        metadata: {
          ...state.metadata,
          didChange: {}
        }
      }
    }
    case "TOGGLE_LAYER": {
      if (action.payload.layerId === state.id) {
        const layoutChange = {
          visibility: state.metadata.isShown ? 'none':'visible'
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
        }
      }
      return defaultLayerReducer(state);
    }
    case "POINTCLOUDS_UPDATE_FEATURES":
    case "POINTCLOUDS_GRID_UPDATE_FEATURES":
    case 'POINTCLOUDS_TIMELINE_UPDATE':
    default:
      return defaultLayerReducer(state);
  }
}

export default combineReducers({
  'pointClouds-layer': pointCloudsLayerReducer
});