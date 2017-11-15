import { combineReducers } from "redux";

const defaultSourceReducer = (state) => {
	return Object.assign({}, state, { 
		metadata: Object.assign({}, state.metadata, {
			didChange: undefined 
		})
	});
}

const mediasSourceReducer = (state = {}, action) => {
	switch (action.type) {
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED': {
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

const gridMediasSourceReducer = (state = {}, action) => {
	switch (action.type) {
		case 'LOGOUT_FULFILLED':
		case 'FETCH_USER_FULFILLED':
		case 'LOGIN_FULFILLED':
		case 'MEDIAS_UPLOAD_FULFILLED':
		case 'MEDIAS_DELETE_FULFILLED': {
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

// Reducer for selected medias source
// (geojson source representing selected medias)
const selectedMediasSourceReducer = (state = {}, action) => {
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
		case "MEDIAS_CLICK": {
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
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, { 
					draggingFeatureId: action.payload.features[0].properties._id 
				})
			});
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
		case "MEDIAS_MAP_END_DRAG": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, { 
					draggingFeatureId: null 
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

export default combineReducers({
	'medias-source': mediasSourceReducer,
	'grid-medias-source': gridMediasSourceReducer,
	'selected-medias-source': selectedMediasSourceReducer
});