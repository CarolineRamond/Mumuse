export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const deleteMediasReducer = (state = initialState, action) => {
	switch(action.type) {
		case "MEDIAS_DELETE_PENDING": {
			return {
				...state,
				pending: action.payload.index,
				error: null,
				data: null
			}
		}
		case "MEDIAS_DELETE_FULFILLED": {
			return {
				...state,
				pending: false,
				error: action.payload.error,
				data: action.payload.data
			};
		}
		case "RESET_MEDIAS_DELETE": {
			return initialState;
		}
		default:
			return state;
	}
}

export default deleteMediasReducer;