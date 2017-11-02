export const selectMapMedias = (mapEvent)=> {
	return { 
		type: 'MEDIAS_MAP_SELECT', 
		payload: { 
			features: mapEvent.features,
			ctrlKey: mapEvent.originalEvent.ctrlKey
		}
	};
};

export const selectCarouselMedias = (features, ctrlKey)=> {
	return { 
		type: 'MEDIAS_CAROUSEL_SELECT', 
		payload: { 
			features: features,
			ctrlKey: ctrlKey
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

export const updateFeaturesMedias = (features, zoom)=> {
	return {
		type: 'MEDIAS_UPDATE_FEATURES',
		payload: { features, zoom },
		meta: {
			throttle: 1000
		}
	};
}

export const updateFeaturesGridMedias = (features, zoom)=> {
	return {
		type: 'MEDIAS_GRID_UPDATE_FEATURES',
		payload: { features, zoom },
		meta: {
			throttle: 1000
		}
	};
}

export const updateTimelineMedias = (value)=> {
	return {
		type: 'MEDIAS_TIMELINE_UPDATE',
		payload: { value }
	};
}

