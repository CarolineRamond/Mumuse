import axios from "axios";

export function adminFetchUsers() {
	console.log('admin fetch users');
	return { 
		type: "ADMIN_FETCH_USERS", 
		payload: axios.get('/userdrive/users')
	}
}
