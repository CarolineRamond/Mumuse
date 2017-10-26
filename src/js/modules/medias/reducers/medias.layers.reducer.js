import { combineReducers } from 'redux';

const defaultLayerReducer = (state) => {
	return Object.assign({}, state, { 
		metadata: Object.assign({}, state.metadata, {
			didChange: undefined 
		})
	});
}

// Reducer for medias layer
// (pointwise media representation, originated from vector tiles)
const mediasLayerReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "MEDIAS_MAP_SELECT": {
	 		// filter out selected medias
	 		const selectedIds = action.payload.features.map((feature)=> {
	 			return feature.properties._id;
	 		});
	 		const filterToAdd = ['!in', '_id'].concat(selectedIds);
	 		const currentFilter = state.filter || ['all'];

	 		return Object.assign({}, state, {
				filter: currentFilter.concat([filterToAdd]),
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
				})
	 		});
			break;
		}
		case "MEDIAS_MAP_DESELECT": {
			if (action.payload.ctrlKey || !state.filter) {
				return defaultLayerReducer(state);
			}
	 		// remove selected medias filter
	 		const newFilter = state.filter.filter((item)=> {
	 			return (item.indexOf('_id') === -1);
	 		});
	 		return Object.assign({}, state, {
				filter: newFilter,
				metadata: Object.assign({}, state.metadata, {
					didChange: { filter: true }
	 			})
	 		});
			break;
		}
		case "MEDIAS_TOGGLE_LAYER": {
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
		case "UPDATE_FEATURES_MEDIAS-LAYER": {
			// store rendered features in layer's metadata
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					renderedFeatures: action.payload.features,
					didChange: undefined
				}),
			});
			break;
		}
		case "UPDATE_FEATURES_GRID-MEDIAS-LAYER": {
			const mediaCount = action.payload.features.reduce((count, feature)=> {
				return count + feature.properties.allMediaCount
			}, 0);
			const previousLocked = state.metadata.isLocked;
			const wasShownBeforeLock = state.metadata.wasShownBeforeLock;
			const newLocked = (mediaCount > 2000 && action.payload.zoom <= 14 ||
				mediaCount / action.payload.features.length > 10);

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
		case 'TIMELINE_CHANGE': {
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

// Reducer for medias grid layer
// (density media representation, originated from vector tiles)
const gridLayerReducer = (state = {}, action) => {
	switch (action.type) {
		case "MEDIAS_TOGGLE_LAYER": {
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
		case "UPDATE_FEATURES_GRID-MEDIAS-LAYER": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					renderedFeatures: action.payload.features,
					didChange: undefined
				}),
			});
	 		break;
		}
		case 'TIMELINE_CHANGE': {
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

// Reducer for selected medias layer
// (geojson source, containing only selected medias)
const selectedMediasLayerReducer = (state = {}, action) => {
	switch (action.type) {
		case "MEDIAS_TOGGLE_LAYER": {
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