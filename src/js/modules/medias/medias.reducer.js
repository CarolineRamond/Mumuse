import _ from 'lodash'; 

const mediasReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "SELECT_MEDIA": {
	 		const selectedIds = action.payload.features.map((feature)=> {
	 			return feature.properties._id;
	 		});
	 		// filter medias-layer :
	 		const layer = state.layers["medias-layer"];
	 		const newLayers = Object.assign({}, state.layers, {
	 			"medias-layer": Object.assign({}, layer, {
	 					filter: ['!in', '_id'].concat(selectedIds),
	 					didChange: { filter: true }
	 				})
	 			}
	 		);

	 		// add feature to selected-medias-source
	 		const source = state.sources["selected-medias-source"];
	 		const newSources = Object.assign({}, state.sources, {
	 			"selected-medias-source": Object.assign({}, source, {
	 					data: Object.assign({}, source.data, {
	 						features: source.data.features.concat(action.payload.features)
	 					}),
	 					didChange: true
	 				})
	 			}
	 		);

	 		return Object.assign({}, state, {
	 			sources: newSources,
	 			layers: newLayers
	 		});
			break;
		}
		case "DESELECT_MEDIAS": {
	 		// remove filter on medias-layer :
	 		const layer = state.layers["medias-layer"];
	 		const newLayers = Object.assign({}, state.layers, {
	 			"medias-layer": Object.assign({}, layer, {
	 					filter: undefined,
	 					didChange: { filter: true }
	 				})
	 			}
	 		);

	 		// remove features from selected-medias-source
	 		const source = state.sources["selected-medias-source"];
	 		const newSources = Object.assign({}, state.sources, {
	 			"selected-medias-source": Object.assign({}, source, {
	 					data: Object.assign({}, source.data, {
	 						features: []
	 					}),
	 					didChange: true
	 				})
	 			}
	 		);

	 		return Object.assign({}, state, {
	 			sources: newSources,
	 			layers: newLayers
	 		});
			break;
		}
		case "START_DRAG_MEDIA": {
			return Object.assign({}, state, {
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: action.payload.features[0].properties._id })
			});
			break;
		}
		case "DRAG_MEDIA": {
			const coords = action.payload.coords;
			const newFeatures = state.sources["medias-source"].data.features.map((feature)=> {
				if (feature.properties._id === state.dragndrop.draggingFeatureId) {
					return Object.assign({}, feature, {
						geometry: Object.assign({}, feature.geometry, {
							coordinates: [coords.lng, coords.lat]
						})
					});
				}
				return feature;
			});
			const newSelectedFeatures = state.sources["selected-medias-source"].data.features.map((feature)=> {
				if (feature.properties._id === state.dragndrop.draggingFeatureId) {
					return Object.assign({}, feature, {
						geometry: Object.assign({}, feature.geometry, {
							coordinates: [coords.lng, coords.lat]
						})
					});
				}
				return feature;
			});
	 		const newSources = Object.assign({}, state.sources, {
	 			"selected-medias-source": Object.assign({}, state.sources["selected-medias-source"], {
	 					data: Object.assign({}, state.sources["selected-medias-source"].data, {
	 						features: newSelectedFeatures
	 					}),
	 					didChange: true
	 				}
	 			),
	 			"medias-source": Object.assign({}, state.sources["medias-source"], {
	 					data: Object.assign({}, state.sources["medias-source"].data, {
	 						features: newFeatures
	 					}),
	 					didChange: true
	 				}
	 			)
	 		});

	 		return Object.assign({}, state, {
	 			sources: newSources
	 		});
			break;
		}
		case "END_DRAG_MEDIA": {
			return Object.assign({}, state, {
				dragndrop: Object.assign({}, state.dragndrop, { draggingFeatureId: null })
			});
			break;
		}
		case "UPDATE_MEDIA_VIEWPORT_COUNT": {
			return Object.assign({}, state, {
				viewportcount: Object.assign({}, state.viewportcount, { value: action.payload.count }),
			});
			break;
		}
		default:
			return state;
	}
}

export default mediasReducer;
