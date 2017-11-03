export function updateWorldState(event) {
	const { lng, lat } = event.target.getCenter();
	const zoom = event.target.getZoom();
	return { 
		type: "UPDATE_WORLD_STATE", 
		payload: {
			lat,
			lng,
			zoom
		} 
	}
}

export function resizeMap() {
	return { 
		type: "RESIZE_MAP", 
		payload: {} 
	}
}