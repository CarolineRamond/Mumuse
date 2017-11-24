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