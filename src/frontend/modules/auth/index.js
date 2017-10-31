const authReducer = (state = null, action) => {
	switch (action.type) {
		case "FETCH_USER_FULFILLED": {
			return action.payload.data;
			break;
		}
		case "FETCH_USER_REJECTED": {
			return null;
			break;
		}
		case "LOGIN_FULFILLED": {
			return action.payload.data;
			break;
		}
		case "LOGIN_REJECTED": {
			console.log(action.payload)
			return null;
			break;
		}
		case "LOGOUT_FULFILLED": {
			return null;
			break;
		}
		default:
			return state;
	}
}

export default authReducer;