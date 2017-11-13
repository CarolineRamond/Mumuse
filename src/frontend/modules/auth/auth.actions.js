import axios from "axios";

export function fetchUser() {
	return { 
		type: "FETCH_USER", 
		payload: axios.get('/userdrive/auth/me')
	}
}

export function login(form) {
	return { 
		type: "LOGIN", 
		payload: axios.post('/userdrive/auth/login', form)
	}
}

export function register(form) {
	return { 
		type: "REGISTER", 
		payload: axios.post('/userdrive/auth/register', form)
	}
}

export function logout() {
	return { 
		type: "LOGOUT", 
		payload: axios.get('/userdrive/auth/logout')
	}
}

export function forgotPassword(form) {
	return { 
		type: "FORGOT_PASSWORD", 
		payload: axios.post('/userdrive/auth/forgot', form)
	}
}

export function resetPassword(form, token) {
	const url = '/userdrive/auth/reset/' + token;
	return { 
		type: "RESET_PASSWORD", 
		payload: axios.post(url, form)
	}
}