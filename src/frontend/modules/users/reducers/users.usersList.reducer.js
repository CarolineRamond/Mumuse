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
		case "CREATE_USER_FULFILLED": {
			return Object.assign({}, state, {
				data: state.data.concat(action.payload.data)
			});
			break;
		}
		case "UPDATE_USER_FULFILLED": {
			const updatedUser = action.payload.data;
			const newData = state.data.map((user)=> {
				if (user._id === updatedUser._id) {
					return updatedUser;
				}
				return user;
			});
			return Object.assign({}, state, {
				data: newData
			});
			break;
		}
		case "DELETE_USERS_FULFILLED": {
			const deletedIds = action.payload;
			const newData = state.data.filter((user)=> {
				return deletedIds.indexOf(user._id) === -1;
			});
			return Object.assign({}, state, {
				data: newData
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default usersListReducer;