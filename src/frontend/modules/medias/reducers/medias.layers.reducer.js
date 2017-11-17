import { combineReducers } from 'redux';

const defaultLayerReducer = (state) => {
	return Object.assign({}, state, { 
		metadata: Object.assign({}, state.metadata, {
			didChange: undefined 
		})
	});
}

const mediasLayerInitialState = {
	id: "medias-layer",
	type: "circle",
	source: "medias-source",
	"source-layer": "user-space-tile-media-source",
	layout: {
	   visibility: "visible"
	},
	paint: {
	   "circle-radius": 7,
	   "circle-color": "red"
	},
	filter: [ 'all', ['has', 'loc'] ],
	minzoom: 13,
	maxzoom: 24,
	metadata: {
	    name: "Medias",
	    isLocked: true,
	    isShown: false,
	    wasShownBeforeLock: true
	}
};

// Reducer for medias layer
// (pointwise media representation, originated from vector tiles)
const mediasLayerReducer = (state = mediasLayerInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_INIT_SELECTED_FULFILLED": {
			const currentFilter  = state.filter || ['all'];
			const feature = action.payload.data;
			return Object.assign({}, state, {
				filter: currentFilter.concat([['!in', '_id', feature.properties._id]]),
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
				})
	 		});
		}
		case "MEDIAS_CLICK":
		case "MEDIAS_SELECT_BY_ID": {
			const currentFilter  = state.filter || ['all'];
			const multiSelect = action.payload.isAdmin && action.payload.ctrlKey;
			var newFilter = currentFilter;
			if (!multiSelect) {
				// deselect previously selected medias (remove filters)
				newFilter = newFilter.filter((item)=> {
					return (item.indexOf('_id') === -1);
				});
			}
			// select newly selected medias (add filters)
			var selectedIds;
			if (action.payload.features) {
				selectedIds = action.payload.features.map((feature)=> {
		 			return feature.properties._id;
		 		});
		 	} else {
		 		selectedIds = [action.payload.mediaId];
		 	}
			const filterToAdd = ['!in', '_id'].concat(selectedIds);
			newFilter = newFilter.concat([filterToAdd]);

			return Object.assign({}, state, {
				filter: newFilter,
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
				})
	 		});
			break;
		}
		case "TOGGLE_LAYER": {
			if (action.payload.layerId === state.id) {
				return Object.assign({}, state, {
					layout: { 
						visibility: state.metadata.isShown ? 'none':'visible'
					},
					metadata: Object.assign({}, state.metadata, {
						isShown: !state.metadata.isShown,
						didChange: {
							layout: { 
								visibility: state.metadata.isShown ? 'none':'visible'
							}
						}
					})
				});
			}
			return defaultLayerReducer(state);
			break;
		}
		case "MEDIAS_GRID_UPDATE_FEATURES": {
			const mediaCount = action.payload.features.reduce((count, feature)=> {
				return count + feature.properties.allMediaCount
			}, 0);
			const previousLocked = state.metadata.isLocked;
			const wasShownBeforeLock = state.metadata.wasShownBeforeLock;
			const newLocked = action.payload.zoom <= 14 &&
				( mediaCount > 2000 || mediaCount / action.payload.features.length > 10);

			// UNLOCK medias
			if (!newLocked && previousLocked && wasShownBeforeLock) {
				const currentFilter = state.filter || ['all'];
				const newFilter = currentFilter.filter((item)=> {
					return (item.indexOf('loc') === -1);
				});

				return Object.assign({}, state, {
					metadata: Object.assign({}, state.metadata, {
						isShown: true,
						isLocked: false,
						didChange: { filter: true, zoom: true, paint: { "circle-opacity": 1 }},
					}),
					filter: newFilter,
					minzoom: 0,
					paint: Object.assign({}, state.paint, {
						"circle-opacity": 1
					})
				});
			// LOCK medias
			} else if (newLocked && !previousLocked) {
				const filterToAdd = ['has', 'loc'];
				const currentFilter = state.filter || ['all'];

				return Object.assign({}, state, {
					metadata: Object.assign({}, state.metadata, {
						isShown: false,
						wasShownBeforeLock: state.metadata.isShown,
						isLocked: true,
						didChange: { filter: true, zoom: true, paint: { "circle-opacity": 0 } },
					}),
					filter: currentFilter.concat([filterToAdd]),
					minzoom: 13,
					paint: Object.assign({}, state.paint, {
						"circle-opacity": 0
					})
				});
			} else {
				return defaultLayerReducer(state);
			}
	 		break;
		}
		case 'MEDIAS_TIMELINE_UPDATE': {
	 		// filter medias according to date:
			const currentFilter = state.filter || ['all'];
	 		const noDateFilter = currentFilter.filter((item)=> {
	 			return (item.indexOf('date') === -1)
	 		});
	 		const filterToAdd = ["<=", "date", action.payload.value];

	 		return Object.assign({}, state, {
				filter: noDateFilter.concat([filterToAdd]),
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
				})
			});
			break;
		}
		default:
			return defaultLayerReducer(state);
	}
}

const gridLayerInitialState = {
	id: "grid-medias-layer",
	type: "fill",
	source: "grid-medias-source",
	"source-layer": "user-space-grid-tile-media-source",
	layout: {
	   visibility: "visible"
	},
	paint: {
	    "fill-color": '#c53a4f',
	    "fill-outline-color": 'rgba(0, 0, 0, 0.3)',
	    "fill-opacity": {
	        "property": "allMediaOpacity",
	        "type": "exponential",
	        "stops" : [
	            [0, 0],
	            [1, 0.2],
	            [100, 0.8]
	        ]
	    }
	},
	minzoom: 0,
	maxzoom: 24,
	metadata: {
	    name: "Medias Grid",
	    isLocked: false,
	    isShown: true,
	    wasShownBeforeLock: true
	}
};

// Reducer for medias grid layer
// (density media representation, originated from vector tiles)
const gridLayerReducer = (state = gridLayerInitialState, action) => {
	switch (action.type) {
		case "TOGGLE_LAYER": {
			if (action.payload.layerId === state.id) {
				return Object.assign({}, state, {
					paint: Object.assign({},state.paint, {
						"fill-opacity": Object.assign({}, state.paint["fill-opacity"], {
		                    property: state.metadata.isShown ? "zeroMediaOpacity": "allMediaOpacity"
		                })
					}),
					metadata: Object.assign({}, state.metadata, {
						isShown: !state.metadata.isShown,
						didChange: {
							paint: { 
								"fill-opacity": Object.assign({}, state.paint["fill-opacity"], {
				                    property: state.metadata.isShown ? "zeroMediaOpacity": "allMediaOpacity"
				                })
							}
						}
					})
				});
			}
			return defaultLayerReducer(state);
			break;
		}
		case 'MEDIAS_TIMELINE_UPDATE': {
	 		// filter grid cells according to date 
			const currentFilter = state.filter || ['all'];
	 		const noDateFilter = currentFilter.filter((item)=> {
	 			return (item.indexOf('minDate') === -1)
	 		});
	 		const filterToAdd = ["<=", "minDate", action.payload.value];

	 		return Object.assign({}, state, {
				filter: noDateFilter.concat([filterToAdd]),
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
				})
			});
			break;
		}
		default:
			return defaultLayerReducer(state);
	}
}

const selectedMediasLayerInitialState = {
	id: "selected-medias-layer",
	type: "circle",
	source: "selected-medias-source",
	layout: {
	   visibility: "visible"
	},
	paint: {
	   "circle-radius": 8,
	   "circle-color": "blue"
	},
	metadata: {
	    name: "Selected Medias",
	    isLocked: false,
	    isShown: true,
	    wasShownBeforeLock: true
	}
}

// Reducer for selected medias layer
// (geojson source, containing only selected medias)
const selectedMediasLayerReducer = (state = selectedMediasLayerInitialState, action) => {
	switch (action.type) {
		case "TOGGLE_LAYER": {
			if (action.payload.layerId === state.id) {
				return Object.assign({}, state, {
					layout: { 
						visibility: state.metadata.isShown ? 'none':'visible'
					},
					metadata: Object.assign({}, state.metadata, {
						isShown: !state.metadata.isShown,
						didChange: {
							layout: { 
								visibility: state.metadata.isShown ? 'none':'visible'
							}
						}
					})
				});
			}
			return defaultLayerReducer(state);
			break;
		}
		default:
			return defaultLayerReducer(state);
	}
}

export default combineReducers({
	'medias-layer': mediasLayerReducer,
	'grid-medias-layer': gridLayerReducer,
	'selected-medias-layer': selectedMediasLayerReducer
});