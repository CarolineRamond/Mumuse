export function getUsersList(state) {
	return state.usersList.data;
}

export function getUsersListState(state) {
	return state.usersList;
}

export function getCurrentUser(state) {
	return state.currentUser.data;
}

export function getCurrentUserState(state) {
	return state.currentUser;
}

export function getCreateUserState(state) {
	return state.createUser;
}

export function getUpdateUserState(state) {
	return state.updateUser;
}

export function getDeleteUsersState(state) {
	return state.deleteUsers;
}
