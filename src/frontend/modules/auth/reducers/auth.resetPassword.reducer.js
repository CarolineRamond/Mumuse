const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const resetPasswordReducer = (state = initialState, action) => {
	switch(action.type) {
		case "RESET_PASSWORD_PENDING": {
			return Object.assign({}, state, {
				pending: true,
				error: null,
				data: null
			});
			break;
		}
		case "RESET_PASSWORD_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: "Success : Your password was successfully reset."
			});
			break;
		}
		case "RESET_PASSWORD_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: "Error resetting your password. Please try again later.",
				data: null
			});
			break;
		}
		default:
			return state;
			break;
	}
}

export default resetPasswordReducer;