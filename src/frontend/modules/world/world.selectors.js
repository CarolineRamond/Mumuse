export const getRootUrl = (state)=> {
	return '/' + [state.lng, state.lat, state.zoom].join(',');
}