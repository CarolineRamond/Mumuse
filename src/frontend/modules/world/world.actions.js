export function updateWorldState({ lng, lat, zoom, bounds }) {
	return { 
		type: "UPDATE_WORLD_STATE", 
		payload: {
			lat,
			lng,
			zoom,
			bounds
		} 
	}
}

export function resizeMap() {
	return { 
		type: "RESIZE_MAP", 
		payload: {} 
	}
}

export function switchPreviewMode() {
	return {
		type: "SWITCH_PREVIEW_MODE",
		payload: {}
	}
}

export const toggleLayer = ({ layerId })=> {
	return {
		type: 'TOGGLE_LAYER',
		payload: {
			layerId
		}
	};
}