import { combineReducers } from "redux";
import authUserReducer from "./reducers/auth.authUser.reducer"
import loginReducer from "./reducers/auth.login.reducer"
import logoutReducer from "./reducers/auth.logout.reducer"
import registerReducer from "./reducers/auth.register.reducer"
import forgotPasswordReducer from "./reducers/auth.forgotPassword.reducer"
import resetPasswordReducer from "./reducers/auth.resetPassword.reducer"

const authReducer = combineReducers({
	authUser: authUserReducer,
	login: loginReducer,
	logout: logoutReducer,
	register: registerReducer,
	forgotPassword: forgotPasswordReducer,
	resetPassword: resetPasswordReducer
});

export default authReducer;

export function getAuthUser(state) {
	return state.authUser.data;
}

export function isAuthUserAdmin(state) {
	return (state.authUser.data && state.authUser.data.roles.indexOf("admin") > -1);
}

export function getAuthUserState(state) {
	return state.authUser;
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

export function getResetPasswordState(state) {
	return state.resetPassword;
}