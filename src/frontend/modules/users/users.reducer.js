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