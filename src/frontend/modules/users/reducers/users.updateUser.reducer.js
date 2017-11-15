const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const udpateUserReducer = (state = initialState, action) => {
	switch(action.type) {
		case "UPDATE_USER_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "UPDATE_USER_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "UPDATE_USER_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.response.data.message || 
					"Error : Could not update user.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default udpateUserReducer;