import { combineReducers } from "redux";

const defaultSourceReducer = (state) => {
	return Object.assign({}, state, { 
		metadata: Object.assign({}, state, {
			didChange: undefined 
		})
	});
}

// Reducer for selected medias source
// (geojson source representing selected medias)
const selectedMediasSourceReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "SELECT_MEDIA": {
	 		// add selected features to source data
	 		return Object.assign({}, state, {
				data: Object.assign({}, state.data, {
					features: state.data.features.concat(action.payload.features)
				}),
				metadata: Object.assign({}, state.metadata, {
					didChange: true
				})
			});
			break;
		}
		case "DESELECT_MEDIAS": {
			if (action.payload.ctrlKey) {
				return defaultSourceReducer(state);
			}
	 		// remove all features from source data
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
		case "START_DRAG_MEDIA": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, { 
					draggingFeatureId: action.payload.features[0].properties._id 
				})
			});
			break;
		}
		case "DRAG_MEDIA": {
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
	 			})
	 		});
			break;
		}
		case "END_DRAG_MEDIA": {
			return Object.assign({}, state, {
				metadata: Object.assign({}, state.metadata, { 
					draggingFeatureId: null 
				})
			});
			break;
		}
		default:
			return defaultSourceReducer(state);
	}	
}

export default combineReducers({
	'medias-source': defaultSourceReducer,
	'grid-medias-source': defaultSourceReducer,
	'selected-medias-source': selectedMediasSourceReducer
});