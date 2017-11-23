export function updateWorldState({ lng, lat, zoom, bounds }) {
	return { 
		type: "UPDATE_WORLD_STATE", 
		payload: {
			lat,
			lng,
			zoom,
			bounds
		},
		meta: {
			validator: {
				lat: {
	                func: (lat, state, payload) => (typeof(lat) === "number"),
	                msg: 'lat must be a number'
	            },
	            lng: {
	                func: (lng, state, payload) => (typeof(lng) === "number"),
	                msg: 'lng must be a number'
	            },
	            zoom: {
	                func: (zoom, state, payload) => (typeof(zoom) === "number"),
	                msg: 'zoom must be a number'
	            },
	            bounds: {
	            	func: (bounds, state, payload) => (Array.isArray(bounds) && bounds.length === 4),
	                msg: 'bounds must be an array of four numbers'
	            }
	        }
		}
	}
}

export function resizeMap() {
	return { 
		type: "RESIZE_MAP"
	}
}

export function switchPreviewMode() {
	return {
		type: "SWITCH_PREVIEW_MODE"
	}
}

export const toggleLayer = ({ layerId })=> {
	return {
		type: 'TOGGLE_LAYER',
		payload: {
			layerId
		},
		meta: {
			validator: {
				layerId: {
	                func: (layerId, state, payload) => (typeof(layerId) === "string"),
	                msg: 'LayerId must be a string'
	            }
	        }
	    }
	};
}