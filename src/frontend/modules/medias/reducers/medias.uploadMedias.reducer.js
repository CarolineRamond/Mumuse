export const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const uploadMediasReducer = (state = initialState, action) => {
	switch(action.type) {
		case "MEDIAS_UPLOAD_PENDING": {
			return {
				...state,
				pending: action.payload.index,
				error: null,
				data: null
			};
		}
		case "MEDIAS_UPLOAD_FULFILLED": {
			return {
				...state,
				pending: false,
				error: action.payload.error,
				data: action.payload.data
			};
		}
		case "RESET_MEDIAS_UPLOAD": {
			return initialState;
		}
		default:
			return state;
	}
}

export default uploadMediasReducer;