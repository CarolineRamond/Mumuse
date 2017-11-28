export const initialState = {
	pending: false,
	data: null,
	error: null
};

const deleteUsersReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'DELETE_USERS_PENDING': {
			return {
				...state,
				pending: true,
				error: null,
				data: null
			};
		}
		case 'DELETE_USERS_FULFILLED': {
			return {
				...state,
				pending: false,
				error: null,
				data: action.payload.data
			};
		}
		case 'DELETE_USERS_REJECTED': {
			const response = action.payload.response;
			let error = `Error ${response.status} (${response.statusText})`;
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
		case 'RESET_DELETE_STATE': {
			return initialState;
		}
		default:
			return state;
	}
};

export default deleteUsersReducer;
