import axios from 'axios';

export const fetchAuthUser = () => {
	return {
		type: 'FETCH_AUTH_USER',
		payload: axios.get('/userdrive/auth/me')
	};
};

export const login = (form) => {
	return {
		type: 'LOGIN',
		payload: axios.post('/userdrive/auth/login', form)
	};
};

export const register = (form) => {
	return {
		type: 'REGISTER',
		payload: axios.post('/userdrive/auth/register', form)
	};
};

export const logout = () => {
	return {
		type: 'LOGOUT',
		payload: axios.get('/userdrive/auth/logout')
	};
};

export const forgotPassword = (form) => {
	return {
		type: 'FORGOT_PASSWORD',
		payload: axios.post('/userdrive/auth/forgot', form)
	};
};

export const resetPassword = (form, token) => {
	const url = '/userdrive/auth/reset/' + token;
	return {
		type: 'RESET_PASSWORD',
		payload: axios.post(url, form)
	};
};
