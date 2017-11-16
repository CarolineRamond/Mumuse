const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const registerReducer = (state = initialState, action) => {
	switch(action.type) {
		case "FORGOT_PASSWORD_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "FORGOT_PASSWORD_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: "Success : an email was sent to your address with further instructions."
			});
			break;
		}
		case "FORGOT_PASSWORD_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: "Error retrieving your account. Please try again later.",
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