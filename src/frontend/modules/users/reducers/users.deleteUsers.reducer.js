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
				data: action.payload
			});
			break;
		}
		case "DELETE_USERS_REJECTED": {
			var error;
			try {
				error = action.payload.response.data.message
			} catch(e) {
				error = "Error : Could not delete user(s).";
			}
			return Object.assign({}, state, {
				pending: false,
				error: error,
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