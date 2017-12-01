export const initialState = {
    pending: false,
    data: null,
    error: null
};

const authUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_AUTH_USER_PENDING': {
            return {
                ...state,
                pending: true,
                data: null,
                error: null
            };
        }
        case 'FETCH_AUTH_USER_FULFILLED':
        case 'LOGIN_FULFILLED': {
            return {
                ...state,
                pending: false,
                data: action.payload.data,
                error: null
            };
        }
        case 'FETCH_AUTH_USER_REJECTED':
        case 'LOGIN_REJECTED': {
            const response = action.payload.response;
            let error = `Error ${response.status} (${response.statusText})`;
            if (response.data && response.data.message) {
                error += ` : ${response.data.message}`;
            }
            return {
                ...state,
                pending: false,
                data: null,
                error: error
            };
        }
        case 'LOGOUT_FULFILLED': {
            return initialState;
        }
        default:
            return state;
    }
};

export default authUserReducer;
