const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const uploadMediasReducer = (state = initialState, action) => {
	switch(action.type) {
		case "MEDIAS_UPLOAD_PENDING": {
			const errors = action.payload.errors;
			return Object.assign({}, state, {
				pending: action.payload.index,
				error: null,
				data: null
			});
			break;
		}
		case "MEDIAS_UPLOAD_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.error,
				data: action.payload.data
			});
			break;
		}
		case "RESET_MEDIAS_UPLOAD": {
			return Object.assign({}, state, {
				pending: false,
				error: null,
				data: null
			});
		}
		default:
			return state;
			break;
	}
}

export default uploadMediasReducer;