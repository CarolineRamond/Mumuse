export const getRootUrl = (state)=> {
	return '/' + [state.lng, state.lat, state.zoom].join(',');
};

export const getMapPreviewMode = (state) => {
	return state.previewMode;
};
