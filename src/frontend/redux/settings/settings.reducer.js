export const initialState = {
    addMode: false,
    bindMode: false,
    deleteMode: false,
    defaultPointColor: '#FCDC00',
    defaultPointSize: 10,
    showModelTexture: true
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SETTINGS_TOGGLE_ADD_MODE': {
            return {
                ...state,
                addMode: !state.addMode,
                bindMode: false,
                deleteMode: false
            };
        }
        case 'SETTINGS_TOGGLE_BIND_MODE': {
            return {
                ...state,
                addMode: false,
                bindMode: !state.bindMode,
                deleteMode: false
            };
        }
        case 'SETTINGS_TOGGLE_DELETE_MODE': {
            return {
                ...state,
                addMode: false,
                bindMode: false,
                deleteMode: !state.deleteMode
            };
        }
        case 'SETTINGS_RESET_MODE': {
            return {
                ...state,
                addMode: false,
                bindMode: false,
                deleteMode: false
            };
        }
        case 'SETTINGS_UPDATE_DEFAULT_COLOR': {
            return {
                ...state,
                defaultPointColor: action.payload.color
            };
        }
        case 'SETTINGS_UPDATE_DEFAULT_POINTSIZE': {
            return {
                ...state,
                defaultPointSize: action.payload.pointSize
            };
        }
        case 'SETTINGS_TOGGLE_MODEL_TEXTURE': {
            return {
                ...state,
                showModelTexture: !state.showModelTexture
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;
