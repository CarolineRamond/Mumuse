export const initialState = {
    pending: false,
    data: null,
    error: null
};

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER_PENDING': {
            return {
                ...state,
                pending: true,
                error: null,
                data: null
            };
        }
        case 'REGISTER_FULFILLED': {
            return {
                ...state,
                pending: false,
                error: null,
                data:
                    'Your account was successfully created. Please check your emails to validate it.'
            };
        }
        case 'REGISTER_REJECTED': {
            return {
                ...state,
                pending: false,
                error: 'Error creating your account. Please try again later.',
                data: null
            };
        }
        default:
            return state;
    }
};

export default registerReducer;
