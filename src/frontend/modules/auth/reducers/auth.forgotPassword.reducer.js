export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const registerReducer = (state = initialState, action) => {
	switch(action.type) {
		case "FORGOT_PASSWORD_PENDING": {
			return {
				...state,
				pending: true,
				error: null,
				data: null
			};
		}
		case "FORGOT_PASSWORD_FULFILLED": {
			return {
				...state,
				pending: false,
				error: null,
				data: "Success : an email was sent to your address with further instructions."
			};
		}
		case "FORGOT_PASSWORD_REJECTED": {
			return {
				...state,
				pending: false,
				error: "Error retrieving your account. Please try again later.",
				data: null
			};
		}
		default:
			return state;
	}
}

export default registerReducer;