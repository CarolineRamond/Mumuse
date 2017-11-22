export const defaultSourceReducer = (state) => {
	return {
		...state,
		metadata: {
			...state.metadata,
			didChange: false
		}
	};
}

export const mediasSourceInitialState = {
	type: "vector",
	tiles: ['http://localhost:8080/userdrive/tile/{z}/{x}/{y}.pbf'],
	metadata: {
	    loaded: false,
	    renderedFeatures: [],
	    didChange: false
	}
};

export const mediasSourceReducer = (state = mediasSourceInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_UPDATE_FEATURES": {
			// store rendered features in source's metadata
			return {
				...state,
				metadata: {
					...state.metadata,
					loaded: true,
					renderedFeatures: action.payload.features,
					didChange: false
				}
			};
		}
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return {
				...state,
				metadata: {
					...state.metadata,
					didChange: true
				}
			}
		}
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED': {
			if (action.payload.data.length > 0) {
				return {
					...state,
					metadata: {
						...state.metadata,
						didChange: true
					}
				}
			} else {
				return defaultSourceReducer(state);
			}
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
	    renderedFeatures: [],
	    didChange: false
	}
};

export const gridMediasSourceReducer = (state = gridMediasSourceInitialState, action) => {
	switch (action.type) {
		case "MEDIAS_GRID_UPDATE_FEATURES": {
			// store rendered features in source's metadata
			return {
				...state,
				metadata: {
					...state.metadata,
					loaded: true,
					renderedFeatures: action.payload.features,
					didChange: false
				}
			}
		}
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return  {
				...state,
				metadata: {
					...state.metadata,
					didChange: true
				}
			}
		}
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED': {
			if (action.payload.data.length > 0) {
				return {
					...state,
					metadata: {
						...state.metadata,
						didChange: true
					}
				}
			} else {
				return defaultSourceReducer(state);
			}
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
			return  {
				...state,
				data: {
					...state.data,
					features: [feature]
				},
				metadata: {
					...state.metadata,
					didChange: true
				}
			}
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

			return {
				...state,
				data: {
					...state.data,
					features: newFeatures
				},
				metadata: {
					...state.metadata,
					didChange: true,
					selectFilterPending: true,
					stillFiltered: stillFiltered
				}
			};
		}
		case 'MEDIAS_UPDATE_FEATURES':
			if (state.metadata.selectFilterPending) {
				return {
					...state,
					metadata: {
						...state.metadata,
						didChange: false,
						selectFilterPending: false,
						stillFiltered: []
					}
				};
			}
			return defaultSourceReducer(state);
		case "MEDIAS_MAP_START_DRAG": {
			if (action.payload.isAdmin) {
				return {
					...state,
					metadata: {
						...state.metadata,
						draggingFeatureId: action.payload.features[0].properties._id
					}
				}
			}
			return defaultSourceReducer(state);
		}
		case "MEDIAS_MAP_DRAG": {
			if (state.metadata.draggingFeatureId && action.payload.isAdmin) {
				const coords = action.payload.coords;
				const newFeatures = state.data.features.map((feature)=> {
					if (feature.properties._id === state.metadata.draggingFeatureId) {
						return {
							...feature,
							geometry: {
								...feature.geometry,
								coordinates: [coords.lng, coords.lat]
							}
						};
					}
					return feature;
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
				}
		 	} else  {
		 		//this case is a priori never reached
		 		// (map does not dispatch MEDIAS_MAP_DRAG action unless an admin is dragging a media)
		 		return defaultSourceReducer(state);
		 	}
		}
		case "MEDIAS_MAP_END_DRAG_PENDING": {
			return {
				...state,
				metadata: {
					...state.metadata,
					draggingFeatureId: null,
					didChange: false
				}
			}
		}
		case "MEDIAS_MAP_END_DRAG_FULFILLED": {
			return {
				...state,
				metadata: {
					...state.metadata,
					didChange: true
				}
			}
		}
		case 'MEDIAS_DELETE_FULFILLED': {
			if (action.payload.data.length > 0) {
				const deletedIds = action.payload.data.map((media)=> {
					return media.properties._id;
				});
				const newFeatures = state.data.features.filter((media)=> {
					return deletedIds.indexOf(media.properties._id) === -1;
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
				}
			} else {
				return defaultSourceReducer(state);				
			}
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