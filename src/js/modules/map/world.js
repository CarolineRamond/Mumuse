// 1- Actions
export function updateWorldState(payload) {
	return { type: "UPDATE_WORLD_STATE", payload }
}

// 2- Reducer
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

