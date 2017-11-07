import { combineReducers } from 'redux';

import usersReducer from './reducers/admin.users.reducer';
import { usersInitialState } from './reducers/admin.users.reducer';

const adminReducer = combineReducers({
	users: usersReducer
});
const adminInitialState = {
	users: usersInitialState
};

// default export : reducer function
export default adminReducer;

// export initialState
export { adminInitialState };

export function getUsers(state) {
	return state.users.list;
}