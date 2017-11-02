const initialState = {
	user: null,
	errorMessage: null,
	successMessage: null
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_USER_FULFILLED": {
			return Object.assign({}, state, {
				user: action.payload.data,
				errorMessage: false,
				successMessage: false
			});
			break;
		}
		case "FETCH_USER_REJECTED": {
			return Object.assign({}, state, {
				user: null
			});
			break;
		}
		case "LOGIN_FULFILLED": {
			return Object.assign({}, state, {
				user: action.payload.data
			});
			break;
		}
		case "LOGIN_REJECTED": {
			return Object.assign({}, state, {
				user: null
			});
			break;
		}
		case "LOGOUT_FULFILLED": {
			return Object.assign({}, state, {
				user: null
			});
			break;
		}
		case "REGISTER_FULFILLED": {
			return Object.assign({}, state, {
				user: null
			});
			break;
		}
		case "REGISTER_REJECTED": {
			return Object.assign({}, state, {
				user: null
			});
			break;
		}
		default:
			return state;
	}
}

export default authReducer;

export function getUser(state) {
	return state.user;
}

export function getLoginState(state) {
	return state.login;
}

export function getRegisterState(state) {
	return state.register;
}

export function getForgotPasswordState(state) {
	return state.forgotPassword;
}