export const initialState = {
    pending: false,
    data: null,
    error: null
};

const resetPasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RESET_PASSWORD_PENDING': {
            return {
                ...state,
                pending: true,
                error: null,
                data: null
            };
        }
        case 'RESET_PASSWORD_FULFILLED': {
            return {
                ...state,
                pending: false,
                error: null,
                data: 'Success : Your password was successfully reset.'
            };
        }
        case 'RESET_PASSWORD_REJECTED': {
            return {
                ...state,
                pending: false,
                error: 'Error resetting your password. Please try again later.',
                data: null
            };
        }
        default:
            return state;
    }
};

export default resetPasswordReducer;
