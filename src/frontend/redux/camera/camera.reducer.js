const initialState = null;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CAMERA_UPDATE': {
            return action.payload.camera;
        }
        default: {
            return state;
        }
    }
};

export default reducer;
