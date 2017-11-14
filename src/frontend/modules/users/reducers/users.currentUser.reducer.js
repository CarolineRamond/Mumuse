const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const currentUserReducer = (state = initialState, action) => {
	switch(action.type) {
		case "FETCH_USER_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "FETCH_USER_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "FETCH_USER_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.response.data.message || 
					"Error : Could not fetch user.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default currentUserReducer;