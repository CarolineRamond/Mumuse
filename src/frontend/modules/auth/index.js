const initialState = {
	user: null,
	login: {
		successMessage: null,
		errorMessage: null
	},
	register: {
		successMessage: null,
		errorMessage: null
	},
	forgotPassword: {
		successMessage: null,
		errorMessage: null
	},
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_USER_FULFILLED": {
			return Object.assign({}, state, {
				user: action.payload.data
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
				user: action.payload.data,
				loginError: null
			});
			break;
		}
		case "LOGIN_REJECTED": {
			return Object.assign({}, state, {
				user: null,
				loginError: action.payload.response.data.message
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
			console.log(action.payload);
			return state;
			break;
		}
		case "REGISTER_REJECTED": {
			return Object.assign({}, state, {
				user: null,
				registerError: action.payload.response.data.message
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