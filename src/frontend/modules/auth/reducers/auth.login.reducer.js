export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const loginReducer = (state = initialState, action) => {
	switch(action.type) {
		case "LOGIN_PENDING": {
			return {
				...state,
				pending: true,
				error: null,
				data: null
			};
		}
		case "LOGIN_FULFILLED": {
			return {
				...state,
				pending: false,
				error: null,
				data: action.payload.data
			};
		}
		case "LOGIN_REJECTED": {
			return {
				...state,
				pending: false,
				error: "Error : Bad username or password.",
				data: null
			};
		}
		default:
			return state;
	}
}

export default loginReducer;