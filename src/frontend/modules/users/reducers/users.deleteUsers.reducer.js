const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const deleteUsersReducer = (state = initialState, action) => {
	switch(action.type) {
		case "DELETE_USERS_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "DELETE_USERS_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "DELETE_USERS_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.response.data.message || 
					"Error : Could not delete user(s).",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default deleteUsersReducer;