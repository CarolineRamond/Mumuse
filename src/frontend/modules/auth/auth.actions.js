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

export function logout() {
	return { 
		type: "LOGOUT", 
		payload: axios.get('/userdrive/auth/logout')
	}
}