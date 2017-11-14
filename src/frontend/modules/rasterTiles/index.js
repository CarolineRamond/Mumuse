const initialState = {
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
		const tilesUrl = 'http://localhost:8081/map/rastertile/' + item._id +
			'/{z}/{x}/{y}.pbf';

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
                isShown: true,
                isInBounds: false
            }
		};
	});
	return { sources, layers };
}

const rasterTilesReducer = (state = initialState, action)=> {
	switch(action.type) {
		case "FETCH_RASTERTILSETS_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				layers: null,
				sources: null
			});
			break;
		}
		case "FETCH_RASTERTILESETS_FULFILLED": {
			const { sources, layers } = _formatTilesData(action.payload.data);
			return Object.assign({}, state, {
				pending: false,
				sources: sources,
				layers: layers
			});
			break;
		}
		case "FETCH_RASTERTILESETS_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.data.message ||
					"Error : Could not retrieve layers"
			});
			break;
		}
		case "TOGGLE_RASTERTILESET": {
			const layer = state.layers[action.payload.layerId];
			const isCurrentlyShown = layer.metadata.isShown;
			const layoutChange = { visibility: isCurrentlyShown ? "none" : "visible" }

			const toggledLayer = Object.assign({}, layer, {
				layout: layoutChange,
				metadata: Object.assign({}, layer.metadata, {
					isShown: !isCurrentlyShown,
					didChange: {
						layout: layoutChange
					}
				})
			});

			return Object.assign({}, state, {
				layers: Object.assign({}, state.layers, {
					[action.payload.layerId]: toggledLayer
				})
			});
			break;
		}
		case "UPDATE_VISIBLE_RASTERTILESETS": {
			return state;
			break;
		}
		default: {
			return state;
		}
	}
}

// default export : reducer function
export default rasterTilesReducer;

export const getVisibleRasterTiles = (state)=> {
	// TODO
	return state;
}