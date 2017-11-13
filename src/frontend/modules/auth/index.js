import { combineReducers } from "redux";
import currentUserReducer from "./reducers/auth.currentUser.reducer"
import loginReducer from "./reducers/auth.login.reducer"
import logoutReducer from "./reducers/auth.logout.reducer"
import registerReducer from "./reducers/auth.register.reducer"
import forgotPasswordReducer from "./reducers/auth.forgotPassword.reducer"

const authReducer = combineReducers({
	currentUser: currentUserReducer,
	login: loginReducer,
	logout: logoutReducer,
	register: registerReducer,
	forgotPassword: forgotPasswordReducer
});

export default authReducer;

export function getCurrentUser(state) {
	return state.currentUser.data;
}

export function getCurrentUserState(state) {
	return state.currentUser;
}

export function getLoginState(state) {
	return state.login;
}

export function getRegisterState(state) {
	return state.register;
}

export function getLogoutState(state) {
	return state.logout;
}

export function getForgotPasswordState(state) {
	return state.forgotPassword;
}