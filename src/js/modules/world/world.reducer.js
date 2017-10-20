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