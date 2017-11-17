const initialState = {
	lng: 0,
	lat: 0,
	zoom: 0,
	previewMode: false,
	shouldMapResize: false
}

const worldReducer = (state = initialState, action) => {
	switch (action.type) {
	 	case "UPDATE_WORLD_STATE": {
			return Object.assign({}, state, {
				lat: action.payload.lat,
				lng: action.payload.lng,
				zoom: action.payload.zoom,
				bounds: action.payload.bounds,
				shouldMapResize: false
			});
			break;
		}
		case "RESIZE_MAP": {
			return Object.assign({}, state, {
				shouldMapResize: true 
			})
		}
		case "SWITCH_PREVIEW_MODE": {
			return Object.assign({}, state, {
				previewMode: !state.previewMode,
				shouldMapResize: true
			})
		}
		default:
			return Object.assign({}, state, {
				shouldMapResize: false
			});
	}
}

export default worldReducer;