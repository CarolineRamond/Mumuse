export const selectMapMedias = (mapEvent)=> {
	return { 
		type: 'MEDIAS_MAP_SELECT', 
		payload: { 
			features: mapEvent.features,
			ctrlKey: mapEvent.originalEvent.ctrlKey
		}
	};
};

export const deselectMapMedias = (mapEvent)=> {
	return { 
		type: 'MEDIAS_MAP_DESELECT', 
		payload: { 
			features: mapEvent.features,
			ctrlKey: mapEvent.originalEvent.ctrlKey
		}
	};
}

export const startDragMapMedias = (mapEvent)=> {
	return {
		type: 'MEDIAS_MAP_START_DRAG',
		payload: {
			features: mapEvent.features
		}
	};
}

export const dragMapMedias = (mapEvent)=> {
	return {
		type: 'MEDIAS_MAP_DRAG',
		payload: {
			coords: mapEvent.lngLat
		}
	};
}

export const endDragMapMedias = (mapEvent)=> {
	return {
		type: 'MEDIAS_MAP_END_DRAG'
	};
}

export const toggleLayerMedias = (layerId)=> {
	return {
		type: 'MEDIAS_TOGGLE_LAYER',
		payload: {
			layerId
		}
	};
}

