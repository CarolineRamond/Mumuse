const usersInitialState = {
	list: [],
	serverError: null
}

const usersReducer = (state = usersInitialState, action) => {
	switch (action.type) {
		case "ADMIN_FETCH_USERS_FULFILLED": {
			console.log('fetch users fulfilled ', action.payload);
			return Object.assign({}, state, {
				list: action.payload.data,
				serverError: null
			});
			break;
		}
		case "ADMIN_FETCH_USERS_REJECTED": {
			return Object.assign({}, state, {
				list: [],
				serverError: action.payload.data.error.message
			});
			break;
		}
		default:
			return state;
	}
}

export default usersReducer;
export { usersInitialState };