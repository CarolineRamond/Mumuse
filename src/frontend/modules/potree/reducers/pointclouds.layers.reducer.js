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
const pointCloudsLayerReducer = (state = pointCloudsLayerInitialState, action) => {
  switch (action.type) {
    case "POINTCLOUDS_INIT_SELECTED_FULFILLED": {
      // const currentFilter  = state.filter || ['all'];
      // const feature = action.payload.data;
      // return Object.assign({}, state, {
      //   filter: currentFilter.concat([['!in', '_id', feature.properties._id]]),
      //   metadata: Object.assign({}, state.metadata, {
      //     didChange: { filter: true }
      //   })
      // });
    }
    case "POINTCLOUDS_CLICK": {
      // const currentFilter  = state.filter || ['all'];
      // const multiSelect = action.payload.isAdmin && action.payload.ctrlKey;
      // var newFilter = currentFilter;
      // if (!multiSelect) {
      //   // deselect previously selected pointClouds (remove filters)
      //   newFilter = newFilter.filter((item)=> {
      //     return (item.indexOf('_id') === -1);
      //   });
      // }
      // // select newly selected pointClouds (add filters)
      // const selectedIds = action.payload.features.map((feature)=> {
      //   return feature.properties._id;
      // });
      // const filterToAdd = ['!in', '_id'].concat(selectedIds);
      // newFilter = newFilter.concat([filterToAdd]);

      // return Object.assign({}, state, {
      //   filter: newFilter,
      //   metadata: Object.assign({}, state.metadata, {
      //     didChange: { filter: true }
      //   })
      // });
      break;
    }
    case "TOGGLE_LAYER": {
      // if (action.payload.layerId === state.id) {
      //   return Object.assign({}, state, {
      //     layout: { 
      //       visibility: state.metadata.isShown ? 'none':'visible'
      //     },
      //     metadata: Object.assign({}, state.metadata, {
      //       isShown: !state.metadata.isShown,
      //       didChange: {
      //         layout: { 
      //           visibility: state.metadata.isShown ? 'none':'visible'
      //         }
      //       }
      //     })
      //   });
      // }
      // return defaultLayerReducer(state);
      break;
    }
    case "POINTCLOUDS_UPDATE_FEATURES": {
      // store rendered features in layer's metadata
      // return Object.assign({}, state, {
      //   metadata: Object.assign({}, state.metadata, {
      //     renderedFeatures: action.payload.features,
      //     didChange: undefined
      //   }),
      // });
      break;
    }
    case "POINTCLOUDS_GRID_UPDATE_FEATURES": {
      // const mediaCount = action.payload.features.reduce((count, feature)=> {
      //   return count + feature.properties.allMediaCount
      // }, 0);
      // const previousLocked = state.metadata.isLocked;
      // const wasShownBeforeLock = state.metadata.wasShownBeforeLock;
      // const newLocked = action.payload.zoom <= 14 &&
      //   ( mediaCount > 2000 || mediaCount / action.payload.features.length > 10);

      // // UNLOCK pointClouds
      // if (!newLocked && previousLocked && wasShownBeforeLock) {
      //   const currentFilter = state.filter || ['all'];
      //   const newFilter = currentFilter.filter((item)=> {
      //     return (item.indexOf('loc') === -1);
      //   });

      //   return Object.assign({}, state, {
      //     metadata: Object.assign({}, state.metadata, {
      //       isShown: true,
      //       isLocked: false,
      //       didChange: { filter: true, zoom: true, paint: { "circle-opacity": 1 }},
      //     }),
      //     filter: newFilter,
      //     minzoom: 0,
      //     paint: Object.assign({}, state.paint, {
      //       "circle-opacity": 1
      //     })
      //   });
      // // LOCK pointClouds
      // } else if (newLocked && !previousLocked) {
      //   const filterToAdd = ['has', 'loc'];
      //   const currentFilter = state.filter || ['all'];

      //   return Object.assign({}, state, {
      //     metadata: Object.assign({}, state.metadata, {
      //       isShown: false,
      //       wasShownBeforeLock: state.metadata.isShown,
      //       isLocked: true,
      //       didChange: { filter: true, zoom: true, paint: { "circle-opacity": 0 } },
      //     }),
      //     filter: currentFilter.concat([filterToAdd]),
      //     minzoom: 13,
      //     paint: Object.assign({}, state.paint, {
      //       "circle-opacity": 0
      //     })
      //   });
      // } else {
      //   return defaultLayerReducer(state);
      // }
      break;
    }
    case 'POINTCLOUDS_TIMELINE_UPDATE': {
      // filter pointClouds according to date:
      // const currentFilter = state.filter || ['all'];
      // const noDateFilter = currentFilter.filter((item)=> {
      //   return (item.indexOf('date') === -1)
      // });
      // const filterToAdd = ["<=", "date", action.payload.value];

      // return Object.assign({}, state, {
      //   filter: noDateFilter.concat([filterToAdd]),
      //   metadata: Object.assign({}, state.metadata, {
      //     didChange: { filter: true }
      //   })
      // });
      break;
    }
    default:
      return defaultLayerReducer(state);
  }
}

export default combineReducers({
  'pointClouds-layer': pointCloudsLayerReducer
});