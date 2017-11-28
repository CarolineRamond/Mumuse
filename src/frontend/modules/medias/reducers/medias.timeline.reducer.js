const timelineReducer = (state = Date.now(), action) => {
	switch (action.type) {
		case 'MEDIAS_TIMELINE_UPDATE': {
			return action.payload.value;
		}
		default:
			return state;
	}
};

export default timelineReducer;
