import _ from 'lodash'; 

const mediasReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "SELECT_MEDIA": {
	 		var newSourceData = selectMedias(state.source.data, action.payload.features);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "SELECT_MEDIA_BY_ID": {
	 		var newSourceData = selectMediaById(state.source.data, action.payload.mediaId);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "DESELECT_MEDIAS": {
	 		var newSourceData = deselectMedias(state.source.data);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "START_DRAG_MEDIA": {
	 		var newSourceData = selectMedias(state.source.data, action.payload.features);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true }),
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: action.payload.features[0].properties._id })
			});
			break;
		}
		case "DRAG_MEDIA": {
	 		var newSourceData = dragMedia(state.source.data, state.dragndrop.draggingFeatureId, action.payload.coords);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "END_DRAG_MEDIA": {
	 		var newSourceData = deselectMedias(state.source.data);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true }),
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: null })
			});
			break;
		}
		case "UPDATE_MEDIA_VIEWPORT_COUNT": {
			const newPaintProperties = { "circle-opacity" : action.payload.count * 0.4 };
			const newLayers = state.layers.map((layer)=> {
				return Object.assign({}, layer, {
					didChange: { filter: false, zoom: false, paint: newPaintProperties, layout: false },
					paint: Object.assign({}, layer.paint, newPaintProperties)
				})
			});

			return Object.assign({}, state, {
				layers: newLayers,
				viewportcount: Object.assign({}, state.viewportcount, { value: action.payload.count }),
			});
			break;
		}
		default:
			return state;
	}
}

export default mediasReducer;


function selectMedias(mediasCollection, selectedFeatures) {
	const selectedIds = selectedFeatures.map((item=> {
		return item.properties._id;
	}));
	const newMedias = mediasCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: selectedIds.indexOf(feature.properties._id) > -1
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, mediasCollection, { features: newMedias });
}

function selectMediaById(mediasCollection, mediaId) {
	const newMedias = mediasCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: feature.properties._id === mediaId
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, mediasCollection, { features: newMedias });
}

function deselectMedias(mediasCollection) {
	const newMedias = mediasCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: false
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, mediasCollection, { features: newMedias });
}

function dragMedia(mediasCollection, draggingMediaId, coords) {
	const newMedias = mediasCollection.features.map((feature)=> {
		if (feature.properties._id === draggingMediaId) {
			return Object.assign({}, feature, { 
				geometry: Object.assign({}, feature.geometry, {
					coordinates: [coords.lng, coords.lat] 
				})
			});
		}
		return Object.assign({}, feature);
	});
	return Object.assign({}, mediasCollection, { features: newMedias });
}
