const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const logoutReducer = (state = initialState, action)=> {
	switch (action.type) {
		case "LOGOUT_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "LOGOUT_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "LOGOUT_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.error,
				data: null
			});
			break;
		}
		default:
			return state;
	}
}

export default logoutReducer;