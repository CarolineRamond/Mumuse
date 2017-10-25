const timelineReducer = (state = Date.now(), action) => {
	switch (action.type) {
		case "TIMELINE_CHANGE": {
			return action.payload.value;
			break;
		}
		default:
			return state;
	}	
}

export default timelineReducer;