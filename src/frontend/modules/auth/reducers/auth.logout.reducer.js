export const initialState = {
    pending: false,
    data: null,
    error: null
};

const logoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGOUT_PENDING': {
            return {
                ...state,
                pending: true,
                error: null,
                data: null
            };
        }
        case 'LOGOUT_FULFILLED': {
            return {
                ...state,
                pending: false,
                error: null,
                data: action.payload.data
            };
        }
        case 'LOGOUT_REJECTED': {
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
        default:
            return state;
    }
};

export default logoutReducer;
