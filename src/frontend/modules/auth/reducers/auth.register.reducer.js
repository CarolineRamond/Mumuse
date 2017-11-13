const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const registerReducer = (state = initialState, action) => {
	switch(action.type) {
		case "REGISTER_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "REGISTER_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: "Your account was successfully created. Please check your emails to validate it."
			});
			break;
		}
		case "REGISTER_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: "Error creating your account. Please try again later.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default registerReducer;