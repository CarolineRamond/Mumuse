export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const usersListReducer = (state = initialState, action) => {
	switch(action.type) {
		case "FETCH_USERS_LIST_PENDING": {
			return {
				...state,
				pending: true,
				error: null,
				data: null
			};
		}
		case "FETCH_USERS_LIST_FULFILLED": {
			return {
				...state,
				pending: false,
				error: null,
				data: action.payload.data
			};
		}
		case "FETCH_USERS_LIST_REJECTED": {
			const response = action.payload.response;
			var error = `Error ${response.status} (${response.statusText})`;
			if (response.data && response.data.message) {
				error += ` : ${response.data.message}`;
			}
			return {
				...state,
				pending: false,
				data: null,
				error: error
			};
		}
		case "CREATE_USER_FULFILLED": {
			return {
				...state,
				data: state.data.concat(action.payload.data)
			};
		}
		case "UPDATE_USER_FULFILLED": {
			const updatedUser = action.payload.data;
			const newData = state.data.map((user)=> {
				if (user._id === updatedUser._id) {
					return updatedUser;
				}
				return user;
			});
			return {
				...state,
				data: newData
			};
		}
		case "DELETE_USERS_FULFILLED": {
			const deletedIds = action.payload;
			const newData = state.data.filter((user)=> {
				return deletedIds.indexOf(user._id) === -1;
			});
			return {
				...state,
				data: newData
			};
		}
		default:
			return state;
	}
}

export default usersListReducer;