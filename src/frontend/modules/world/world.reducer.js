export const initialState = {
    lng: 0,
    lat: 0,
    zoom: 0,
    previewMode: false
};

const worldReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_WORLD_STATE': {
            return {
                ...state,
                lat: action.payload.lat,
                lng: action.payload.lng,
                zoom: action.payload.zoom,
                bounds: action.payload.bounds
            };
        }
        case 'SWITCH_PREVIEW_MODE': {
            return {
                ...state,
                previewMode: !state.previewMode
            };
        }
        default:
            return state;
    }
};

export default worldReducer;
