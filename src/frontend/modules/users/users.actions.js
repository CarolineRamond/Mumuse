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

export function resetCreateState() {
	return {
		type: "RESET_CREATE_STATE"
	};
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

export function resetUpdateState() {
	return {
		type: "RESET_UPDATE_STATE"
	};
}

export function deleteUsers(userIds) {
	const payload = new Promise((resolve, reject)=> {
		var promise = userIds.reduce((promise, userId)=> {
			return promise.then(() => { 
				return _deleteUser(userId);
			})
		}, Promise.resolve());
		promise.then(()=> resolve({ data: userIds }))
	});
	
    return { 
		type: "DELETE_USERS",
		payload: payload
	}
}

export function resetDeleteState() {
	return {
		type: "RESET_DELETE_STATE"
	};
}

function _deleteUser(userId) {
    return axios.delete('/userdrive/users/' + userId);
}
