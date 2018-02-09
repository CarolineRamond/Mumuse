import axios from 'axios';

/** This is action FETCH AUTH USER */
export const fetchAuthUser = () => {
    return {
        type: 'FETCH_AUTH_USER',
        payload: axios.get('/userdrive/auth/me')
    };
};

/** This is action LOGIN */
export const login = form => {
    return {
        type: 'LOGIN',
        payload: axios.post('/userdrive/auth/login', form)
    };
};

/** This is action RESET LOGIN STATE */
export const resetLoginState = () => {
    return {
        type: 'LOGIN_RESET'
    };
};

export const register = form => {
    return {
        type: 'REGISTER',
        payload: axios.post('/userdrive/auth/register', form)
    };
};

export const resetRegisterState = () => {
    return {
        type: 'REGISTER_RESET'
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT',
        payload: axios.get('/userdrive/auth/logout')
    };
};

export const forgotPassword = form => {
    return {
        type: 'FORGOT_PASSWORD',
        payload: axios.post('/userdrive/auth/forgot', form)
    };
};

export const resetForgotPasswordState = () => {
    return {
        type: 'FORGOT_PASSWORD_RESET'
    };
};

export const resetPassword = (form, token) => {
    const url = '/userdrive/auth/reset/' + token;
    return {
        type: 'RESET_PASSWORD',
        payload: axios.post(url, form)
    };
};

export const resetResetPasswordState = () => {
    return {
        type: 'RESET_PASSWORD_RESET'
    };
};
