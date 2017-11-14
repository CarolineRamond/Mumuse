import { combineReducers } from "redux";
import usersListReducer from "./reducers/users.usersList.reducer"
import currentUserReducer from "./reducers/users.currentUser.reducer"
import createUserReducer from "./reducers/users.createUser.reducer"
import updateUserReducer from "./reducers/users.updateUser.reducer"
import deleteUsersReducer from "./reducers/users.deleteUsers.reducer"

const usersReducer = combineReducers({
	usersList: usersListReducer,
	currentUser: currentUserReducer,
	createUser: createUserReducer,
	updateUser: updateUserReducer,
	deleteUsers: deleteUsersReducer
});

export default usersReducer;

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
