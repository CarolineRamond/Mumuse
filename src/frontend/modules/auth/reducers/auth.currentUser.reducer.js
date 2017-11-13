const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const currentUserReducer = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_USER_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				data: null,
				error: null
			});
			break;
		}
		case "FETCH_USER_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				data: action.payload.data,
				error: null
			});
			break;
		}
		case "FETCH_USER_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				data: null,
				error: action.payload.error
			});
			break;
		}
		case "LOGIN_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				data: action.payload.data,
				error: null
			});
		}
		case "LOGIN_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				data: null,
				error: null
			});
		}
		case "LOGOUT_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				data: null,
				error: null
			});
		}
		default:
			return state;
			break;
	}
}

export default currentUserReducer;