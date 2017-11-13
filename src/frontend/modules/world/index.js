import worldInitialState from './world.initialState';
import worldMapConfig from './world.map.config'

const worldReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "UPDATE_WORLD_STATE": {
			return Object.assign({}, state, {
				lat: action.payload.lat,
				lng: action.payload.lng,
				zoom: action.payload.zoom,
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
			})
		}
		default:
			return Object.assign({}, state, {
				shouldMapResize: false
			});
	}
}

export default worldReducer;

export const getRootUrl = (state)=> {
	return '/' + [state.lng, state.lat, state.zoom].join(',');
}

// export initialState & mapInteractions
export { worldInitialState, worldMapConfig };