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
			if (action.payload.ctrlKey) {
				return state;
			}
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
		case "UPDATE_FEATURES_MEDIAS-LAYER": {
			const layer = state.layers["medias-layer"];
			const newLayers = Object.assign({}, state.layers, {
				"medias-layer": Object.assign({}, layer, {
						metadata: Object.assign({}, layer.metadata, {
							renderedFeatures: action.payload.features
						}),
						didChange: undefined
					})
				});

			return Object.assign({}, state, {
	 			layers: newLayers
	 		});
			break;
		}
		case "UPDATE_FEATURES_GRID-MEDIAS-LAYER": {
			const mediasLayer = state.layers["medias-layer"];
			const gridLayer = state.layers["grid-medias-layer"];
			const mediaCount = action.payload.features.reduce((count, feature)=> {
				return count + feature.properties.allMediaCount
			}, 0);
			const previousLocked = mediasLayer.metadata.isLocked;
			const wasShownBeforeLock = mediasLayer.metadata.wasShownBeforeLock;
			const newLocked = (mediaCount > 2000 && action.payload.zoom <= 14 ||
				mediaCount / action.payload.features.length > 10);

			var newLayers;

			// UNLOCK medias
			if (!newLocked && previousLocked && wasShownBeforeLock) {
				newLayers = Object.assign({}, state.layers, {
					"grid-medias-layer": Object.assign({}, gridLayer, {
						metadata: Object.assign({}, gridLayer.metadata, {
							renderedFeatures: action.payload.features
						})
					}),
					"medias-layer": Object.assign({}, mediasLayer, {
						metadata: Object.assign({}, mediasLayer.metadata, {
							isShown: true,
							isLocked: false
						}),
						didChange: { filter: true, zoom: true, paint: { "circle-opacity": 1 }},
						filter: undefined,
						minzoom: 0,
						paint: Object.assign({}, mediasLayer.paint, {
							"circle-opacity": 1
						})
					})
				});
			// LOCK medias
			} else if (newLocked && !previousLocked) {
				newLayers = Object.assign({}, state.layers, {
					"grid-medias-layer": Object.assign({}, gridLayer, {
						metadata: Object.assign({}, gridLayer.metadata, {
							renderedFeatures: action.payload.features
						})
					}),
					"medias-layer": Object.assign({}, mediasLayer, {
						metadata: Object.assign({}, mediasLayer.metadata, {
							isShown: false,
							wasShownBeforeLock: mediasLayer.metadata.isShown,
							isLocked: true
						}),
						didChange: { filter: true, zoom: true, paint: { "circle-opacity": 0 } },
						filter: [ 'all', ['has', 'loc'] ],
						minzoom: 13,
						paint: Object.assign({}, mediasLayer.paint, {
							"circle-opacity": 0
						})
					})
				});
			} else {
				newLayers = Object.assign({}, state.layers, {
					"grid-medias-layer": Object.assign({}, gridLayer, {
						metadata: Object.assign({}, gridLayer.metadata, {
							renderedFeatures: action.payload.features
						})
					})
				});
			}

			return Object.assign({}, state, {
	 			layers: newLayers
	 		});
	 		break;
		}
		default:
			return state;
	}
}

// default export : reducer function
export default mediasReducer;

// other exports : selectors
// (to expose data to components)
export const getVisibleMedias = (state) => {
	return state.layers["medias-layer"].metadata.renderedFeatures;
}

export const getSelectedMedias = (state) => {
	return state.sources["selected-medias-source"].data.features;
}

export const getViewportMediaCount = (state) => {
	if (!state.layers["medias-layer"].metadata.isLocked && 
		state.layers["medias-layer"].metadata.renderedFeatures.length > 0) {
		// point layer is visible : return exact media count
		return state.layers["medias-layer"].metadata.renderedFeatures.length +
			state.sources["selected-medias-source"].data.features.length;
	} else {
		// point layer is locked : return grid count (approximative)
		var count = state.layers["grid-medias-layer"].metadata.renderedFeatures.reduce((c, feature)=> {
			return c + feature.properties.allMediaCount;
		}, 0);
		return '~' + count.toString();
	}
}