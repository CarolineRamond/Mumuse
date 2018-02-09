/** This is auth reducer */
import { combineReducers } from 'redux';
import authUserReducer from './reducers/auth.authUser.reducer';
import loginReducer from './reducers/auth.login.reducer';
import logoutReducer from './reducers/auth.logout.reducer';
import registerReducer from './reducers/auth.register.reducer';
import forgotPasswordReducer from './reducers/auth.forgotPassword.reducer';
import resetPasswordReducer from './reducers/auth.resetPassword.reducer';

const authReducer = combineReducers({
    authUser: authUserReducer,
    login: loginReducer,
    logout: logoutReducer,
    register: registerReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer
});

export default authReducer;
