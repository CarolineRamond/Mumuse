const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const loginReducer = (state = initialState, action) => {
	switch(action.type) {
		case "LOGIN_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "LOGIN_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: action.payload.data
			});
			break;
		}
		case "LOGIN_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: "Error : Bad username or password.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default loginReducer;