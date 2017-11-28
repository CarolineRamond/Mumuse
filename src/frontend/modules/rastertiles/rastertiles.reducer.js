import { forIn } from "lodash";
const baseUrl = (window.location.origin !== "null") ? window.location.origin : "http://localhost:8080";

export const initialState = {
	pending: false,
	error: null,
	layers: null,
	sources: null
}

const _formatTilesData = (tilesets)=> {
	var sources = {};
	var layers = {};

	tilesets.map((item)=> {
		const sourceName = item._id + "-source";
		const layerName = item._id + "-layer";
		const tilesUrl = `${baseUrl}/map/rastertile/${item._id}/{z}/{x}/{y}.pbf`;

		sources[sourceName] = {
			type: "raster",
			tiles: [tilesUrl],
			tileSize: item.tileSize || 256,
            minzoom: item.minzoom || 10,
            maxzoom: item.maxzoom || 22,
            bounds: item.bounds
		};

		layers[layerName] = {
			id: layerName,
            type: "raster",
            source: sourceName,
            minzoom: item.minzoom || 10,
            maxzoom: item.maxzoom || 22,
            layout: {
            	visibility: "visible"
            },
            metadata: {
            	name: item.name,
            	bounds: item.bounds,
                isShown: true,
                isInBounds: false,
                priority: item.priority || 0
            }
		};
	});
	return { sources, layers };
}

const _boundsIntersect = (boundsA, boundsB)=> {
	const intersectLng = !(boundsA[2] < boundsB[0] || boundsA[0] > boundsB[2]);
	const intersectLat = !(boundsA[3] < boundsB[1] || boundsA[1] > boundsB[3]);
	return (intersectLng && intersectLat);
}

const rastertilesReducer = (state = initialState, action)=> {
	switch(action.type) {
		case "FETCH_RASTERTILESETS_PENDING": {
			return {
				...state,
				pending: true,
				error: null,
				layers: null,
				sources: null
			};
		}
		case "FETCH_RASTERTILESETS_FULFILLED": {
			const { sources, layers } = _formatTilesData(action.payload.data);
			return {
				...state,
				pending: false,
				sources: sources,
				layers: layers
			};
		}
		case "FETCH_RASTERTILESETS_REJECTED": {
			const response = action.payload.response;
			var error = `Error ${response.status} (${response.statusText})`;
			if (response.data && response.data.message) {
				error += ` : ${response.data.message}`;
			}
			return {
				...state,
				pending: false,
				sources: null,
				layers: null,
				error: error
			};
		}
		case "TOGGLE_LAYER": {
			if (state.layers[action.payload.layerId]) {
				const layer = state.layers[action.payload.layerId];
				const isCurrentlyShown = layer.metadata.isShown;
				const layoutChange = { visibility: isCurrentlyShown ? "none" : "visible" }

				const toggledLayer = {
					...layer,
					layout: layoutChange,
					metadata: {
						...layer.metadata,
						isShown: !isCurrentlyShown,
						didChange: {
							layout: layoutChange
						}
					}
				};

				return {
					...state,
					layers: {
						...state.layers,
						[action.payload.layerId]: toggledLayer
					}
				};
			} else {
				return state;
			}
		}
		case "UPDATE_WORLD_STATE": {
			const mapBounds = action.payload.bounds
			var newLayers = {};
			forIn(state.layers, (layer, layerId)=> {
				newLayers[layerId] = {
					...layer,
					metadata: {
						...layer.metadata,
						isInBounds: _boundsIntersect(layer.metadata.bounds, mapBounds)
					}
				};
			});
			return {
				...state,
				layers: newLayers
			};
		}
		default: {
			return state;
		}
	}
}

// default export : reducer function
export default rastertilesReducer;