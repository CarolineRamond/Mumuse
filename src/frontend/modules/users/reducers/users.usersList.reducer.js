const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const usersListReducer = (state = initialState, action) => {
	switch(action.type) {
		case "FETCH_USERS_LIST_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "FETCH_USERS_LIST_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "FETCH_USERS_LIST_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.response.data.message || 
					"Error : Could not fetch users list from server.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default usersListReducer;