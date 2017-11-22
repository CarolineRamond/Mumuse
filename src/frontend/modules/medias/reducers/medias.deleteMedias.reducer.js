const initialState = { 
	pending: false, 
	data: null, 
	error: null
};

const deleteMediasReducer = (state = initialState, action) => {
	switch(action.type) {
		case "MEDIAS_DELETE_PENDING": {
			return Object.assign({}, state, {
				pending: action.payload.index,
				error: null,
				data: null
			});
			break;
		}
		case "MEDIAS_DELETE_FULFILLED": {
			return Object.assign({}, state, {
				pending: false,
				error: action.payload.error,
				data: action.payload.data
			});
			break;
		}
		case "RESET_MEDIAS_DELETE": {
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

export default deleteMediasReducer;