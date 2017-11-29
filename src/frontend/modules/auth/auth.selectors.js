export const getAuthUser = (state) => {
	return state.authUser.data;
};

export const isAuthUserAdmin = (state) => {
	return (state.authUser.data && state.authUser.data.roles.indexOf('admin') > -1);
};

export const getAuthUserState = (state) => {
	return state.authUser;
};

export const getLoginState = (state) => {
	return state.login;
};

export const getRegisterState = (state) => {
	return state.register;
};

export const getLogoutState = (state) => {
	return state.logout;
};

export const getForgotPasswordState = (state) => {
	return state.forgotPassword;
};

export const getResetPasswordState = (state) => {
	return state.resetPassword;
};
