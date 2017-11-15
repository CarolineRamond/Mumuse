import axios from "axios";

export function fetchUsersList() {
	return { 
		type: "FETCH_USERS_LIST", 
		payload: axios.get('/userdrive/users')
	}
}

export function createUser(form) {
	return { 
		type: "CREATE_USER", 
		payload: axios.post('/userdrive/users', form)
	}
}

export function fetchUser(userId) {
	return { 
		type: "FETCH_USER", 
		payload: axios.get('/userdrive/users/' + userId)
	}
}

export function updateUser(form, userId) {
	return { 
		type: "UPDATE_USER", 
		payload: axios.put('/userdrive/users/' + userId, form)
	}
}

export function deleteUsers(userIds) {
	const payload = new Promise((resolve, reject)=> {
		var promise = userIds.reduce((promise, userId)=> {
			return promise.then(() => { 
				return _deleteUser(userId);
			})
		}, Promise.resolve());
		promise.then(()=> resolve(userIds))
	});
	
    return { 
		type: "DELETE_USERS",
		payload: payload
	}
}


function _deleteUser(userId) {
    return axios.delete('/userdrive/users/' + userId);
}
