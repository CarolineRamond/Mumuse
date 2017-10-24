export const selectMedias = (mapEvent)=> {
	return { 
		type: 'MEDIAS_SELECT', 
		payload: { 
			features: mapEvent.features,
			ctrlKey: mapEvent.ctrlKey
		}
	};
};

export const deselectMedias = (mapEvent)=> {
	return { 
		type: 'MEDIAS_DESELECT', 
		payload: { 
			features: mapEvent.features,
			ctrlKey: mapEvent.ctrlKey
		}
	};
}

export const startDragMedia = (mapEvent)=> {
	return {
		type: 'MEDIAS_START_DRAG',
		payload: {
			features: mapEvent.features
		}
	};
}

export const dragMedia = (mapEvent)=> {
	return {
		type: 'MEDIAS_DRAG',
		payload: {
			coords: mapEvent.lngLat
		}
	};
}

export const endDragMedia = (mapEvent)=> {
	return {
		type: 'MEDIAS_END_DRAG'
	};
}

