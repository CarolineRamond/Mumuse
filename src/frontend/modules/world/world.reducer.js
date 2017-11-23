export const initialState = {
	lng: 0,
	lat: 0,
	zoom: 0,
	previewMode: false,
	shouldMapResize: false
}

export const defaultReducer = (state) => {
	return {
		...state,
		shouldMapResize: false
	};
}

const worldReducer = (state = initialState, action) => {
	switch (action.type) {
	 	case "UPDATE_WORLD_STATE": {
			return {
				...state,
				lat: action.payload.lat,
				lng: action.payload.lng,
				zoom: action.payload.zoom,
				bounds: action.payload.bounds,
				shouldMapResize: false
			};
		}
		case "RESIZE_MAP": {
			return {
				...state,
				shouldMapResize: true 
			};
		}
		case "SWITCH_PREVIEW_MODE": {
			return {
				...state,
				previewMode: !state.previewMode,
				shouldMapResize: true
			};
		}
		default:
			return defaultReducer(state);
	}
}

export default worldReducer;