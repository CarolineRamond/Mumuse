export const initialState = {
    pending: false,
    error: null,
    data: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LAUNCH_CALC_PENDING': {
            return {
                pending: true,
                error: null,
                data: null
            };
        }
        case 'LAUNCH_CALC_FULFILLED': {
            return {
                pending: false,
                error: null,
                data: action.payload.data
            };
        }
        case 'LAUNCH_CALC_REJECTED': {
            return {
                pending: false,
                error: action.payload.error,
                data: null
            };
        }
        default:
            return state;
    }
};

export default reducer;
