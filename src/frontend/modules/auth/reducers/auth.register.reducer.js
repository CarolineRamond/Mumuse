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
				data: action.payload.data
			});
			break;
		}
		case "REGISTER_REJECTED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.error,
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