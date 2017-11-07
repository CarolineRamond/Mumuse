import axios from "axios";

export function adminFetchUsers() {
	return { 
		type: "ADMIN_FETCH_USERS", 
		payload: axios.get('/userdrive/users')
	}
}

export function adminCreateUser(form) {
	return { 
		type: "ADMIN_CREATE_USER", 
		payload: axios.post('/userdrive/users', form)
	}
}
