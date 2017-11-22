const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const uploadMediasReducer = (state = initialState, action) => {
	switch(action.type) {
		case "MEDIAS_UPLOAD_PENDING": {
			return Object.assign({}, state, {
				pending: {
					index: action.payload.index,
					length: action.payload.length
				},
				error: null,
				data: null
			});
			break;
		}
		case "MEDIAS_UPLOAD_FULFILLED": {
			return Object.assign({}, state, {
				pending: {
					index: action.payload.length,
					length: action.payload.length
				},
				error: null,
				data: true
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