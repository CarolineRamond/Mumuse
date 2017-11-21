export const defaultSourceReducer = (state) => {
	return Object.assign({}, state, { 
		metadata: Object.assign({}, state.metadata, {
			didChange: undefined 
		})
	});
}

export const mediasSourceInitialState = {
	type: "vector",
	tiles: ['http://localhost:8080/userdrive/tile/{z}/{x}/{y}.pbf'],
	metadata: {
	    loaded: false,
	    renderedFeatures: []
	}
};

export const mediasSourceReducer = (state = mediasSourceInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_UPDATE_FEATURES": {
			// store rendered features in source's metadata
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					loaded: true,
					renderedFeatures: action.payload.features,
					didChange: false
				}),
			});
			break;
		}
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED':
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					didChange: true
				})
			});
			break;
		}
		default:
			return defaultSourceReducer(state);
	}
}

export const gridMediasSourceInitialState = {
	type: "vector",
	tiles: ['http://localhost:8080/userdrive/tile/grid/{z}/{x}/{y}.pbf'],
	metadata: {
	    loaded: false,
	    renderedFeatures: []
	}
};

export const gridMediasSourceReducer = (state = gridMediasSourceInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_GRID_UPDATE_FEATURES": {
			// store rendered features in source's metadata
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					loaded: true,
					renderedFeatures: action.payload.features,
					didChange: false
				}),
			});
	 		break;
		}
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED':
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					didChange: true
				})
			});
			break;
		}
		default:
			return defaultSourceReducer(state);
	}
}

export const selectedMediasSourceInitialState = {
	type: "geojson",
	data: { 
	    type: "FeatureCollection",
	    features: []
	},
	metadata: {
	    didChange: false,
	    selectFilterPending: false,
	    stillFiltered: []
	}
};

// Reducer for selected medias source
// (geojson source representing selected medias)
export const selectedMediasSourceReducer = (state = selectedMediasSourceInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_INIT_SELECTED_FULFILLED": {
			const feature = action.payload.data;
			return Object.assign({}, state, {
				data: Object.assign({}, state.data, {
					features: [feature]
				}),
				metadata: Object.assign({}, state.metadata, {
					didChange: true,
				})
			});
		}
		case "MEDIAS_CLICK":
		case "MEDIAS_SELECT_BY_ID": {
			const multiSelect = action.payload.isAdmin && action.payload.ctrlKey;
			var newFeatures = [];
			if (multiSelect) {
				// keep previously selected medias (remove features)
				newFeatures = newFeatures.concat(state.data.features);
			}
			// select clicked medias
			newFeatures = newFeatures.concat(action.payload.features);

			var stillFiltered = [];
			if (state.metadata.selectFilterPending) {
				stillFiltered = state.metadata.stillFiltered;
			} else {
				stillFiltered = state.data.features;
			}

	 		return Object.assign({}, state, {
				data: Object.assign({}, state.data, {
					features: newFeatures
				}),
				metadata: Object.assign({}, state.metadata, {
					didChange: true,
					selectFilterPending: true,
					stillFiltered: stillFiltered
				})
			});
			break;
		}
		case 'MEDIAS_UPDATE_FEATURES':
			if (state.metadata.selectFilterPending) {
		 		return Object.assign({}, state, {
					metadata: Object.assign({}, state.metadata, {
						didChange: false,
						selectFilterPending: false,
						stillFiltered: []
					})
				});
			}
			return defaultSourceReducer(state);
			break;
		case "MEDIAS_MAP_START_DRAG": {
			if (action.payload.isAdmin) {
				return Object.assign({}, state, {
					metadata: Object.assign({}, state.metadata, { 
						draggingFeatureId: action.payload.features[0].properties._id 
					})
				});
			}
			return defaultSourceReducer(state);
			break;
		}
		case "MEDIAS_MAP_DRAG": {
			const coords = action.payload.coords;
			const newFeatures = state.data.features.map((feature)=> {
				if (feature.properties._id === state.metadata.draggingFeatureId) {
					return Object.assign({}, feature, {
						geometry: Object.assign({}, feature.geometry, {
							coordinates: [coords.lng, coords.lat]
						})
					});
				}
				return feature;
			});
	 		return Object.assign({}, state, {
	 			data: Object.assign({}, state.data, {
	 				features: newFeatures
	 			}),
	 			metadata: Object.assign({}, state.metadata, {
					didChange: true
				})
	 		});
			break;
		}
		case "MEDIAS_MAP_END_DRAG_PENDING": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, {
					draggingFeatureId: null,
					didChange: false
				})
			});
			break;
		}
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, { 
					didChange: true
				})
			});
			break;
		}
		case 'MEDIAS_DELETE_FULFILLED': {
			return Object.assign({}, state, {
	 			data: Object.assign({}, state.data, {
	 				features: []
	 			}),
	 			metadata: Object.assign({}, state.metadata, {
					didChange: true
				})
	 		});
			break;
		}
		default:
			return defaultSourceReducer(state);
	}	
}

export const sourcesInitialState = {
	"medias-source": mediasSourceInitialState,
	"selected-medias-source": selectedMediasSourceInitialState,
	"grid-medias-source": gridMediasSourceInitialState
};

export default (state=sourcesInitialState, action)=> {
	switch (action.type) {
		case 'MEDIAS_SELECT_BY_ID': {
			const selectedFeature = state["medias-source"].metadata.renderedFeatures.find((item)=> {
				return item.properties._id === action.payload.mediaId;
			});
			action.payload.features = [selectedFeature];
		}
		default: {
			return {
				"medias-source": mediasSourceReducer(state["medias-source"], action),
				"selected-medias-source": selectedMediasSourceReducer(state["selected-medias-source"], action),
				"grid-medias-source": gridMediasSourceReducer(state["grid-medias-source"], action)
			}
		}
	}
}