import worldInitialState from './world.initialState';
import worldMapConfig from './world.map.config'

const worldReducer = (state = {}, action) => {
	switch (action.type) {
	 	case "UPDATE_WORLD_STATE": {
			return Object.assign({}, state, action.payload);
			break;
		}
		default:
			return state;
	}
}

export default worldReducer;

// export initialState & mapInteractions
export { worldInitialState, worldMapConfig };