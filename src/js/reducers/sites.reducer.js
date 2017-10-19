import _ from 'lodash'; 

const sitesReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "SELECT_SITE": {
	 		var newSourceData = selectSites(state.source.data, action.payload.features);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "SELECT_SITE_BY_ID": {
	 		var newSourceData = selectSiteById(state.source.data, action.payload.siteId);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "DESELECT_SITES": {
	 		var newSourceData = deselectSites(state.source.data);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "START_DRAG_SITE": {
	 		var newSourceData = selectSites(state.source.data, action.payload.features);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true }),
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: action.payload.features[0].properties._id })
			});
			break;
		}
		case "DRAG_SITE": {
	 		var newSourceData = dragSite(state.source.data, state.dragndrop.draggingFeatureId, action.payload.coords);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true })
			});
			break;
		}
		case "END_DRAG_SITE": {
	 		var newSourceData = deselectSites(state.source.data);
			return Object.assign({}, state, {
				source: Object.assign({}, state.source, { data: newSourceData, didChange: true }),
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: null })
			});
			break;
		}
		case "UPDATE_SITE_VIEWPORT_COUNT": {
			return Object.assign({}, state, {
				viewportcount: Object.assign({}, state.viewportcount, { value: action.payload.count }),
			});
			break;
		}
		default:
			return state;
	}
}

export default sitesReducer;


function selectSites(sitesCollection, selectedFeatures) {
	const selectedIds = selectedFeatures.map((item=> {
		return item.properties._id;
	}));
	const newSites = sitesCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: selectedIds.indexOf(feature.properties._id) > -1
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, sitesCollection, { features: newSites });
}

function selectSiteById(sitesCollection, siteId) {
	const newSites = sitesCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: feature.properties._id === siteId
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, sitesCollection, { features: newSites });
}

function deselectSites(sitesCollection) {
	const newSites = sitesCollection.features.map((feature)=> {
		const newProperties = Object.assign({}, feature.properties, {
			selected: false
		});
		return Object.assign({}, feature, { properties: newProperties });
	});
	return Object.assign({}, sitesCollection, { features: newSites });
}

function dragSite(sitesCollection, draggingSiteId, coords) {
	const newSites = sitesCollection.features.map((feature)=> {
		if (feature.properties._id === draggingSiteId) {
			return Object.assign({}, feature, { 
				geometry: Object.assign({}, feature.geometry, {
					coordinates: [coords.lng, coords.lat] 
				})
			});
		}
		return Object.assign({}, feature);
	});
	return Object.assign({}, sitesCollection, { features: newSites });
}
