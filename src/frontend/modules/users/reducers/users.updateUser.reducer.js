export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const udpateUserReducer = (state = initialState, action) => {
	switch(action.type) {
		case "UPDATE_USER_PENDING": {
			return {
				...state,
				pending: true,
				error: null,
				data: null
			};
		}
		case "UPDATE_USER_FULFILLED": {
			return {
				...state,
				pending: false,
				error: null,
				data: action.payload.data
			};
		}
		case "UPDATE_USER_REJECTED": {
			const response = action.payload.response;
			var error = `Error ${response.status} (${response.statusText})`;
			if (response.data && response.data.message) {
				error += ` : ${response.data.message}`;
			}
			return {
				...state,
				pending: false,
				data: null,
				error: error
			};
		}
		case "RESET_UPDATE_STATE": {
			return initialState;
		}
		default:
			return state;
	}
}

export default udpateUserReducer;