export const initialState = {
    addMode: false,
    bindMode: false,
    deleteMode: false,
    defaultPointColor2D: '#FCDC00',
    pointSize2D: 10,
    pointWeight2D: 1,
    defaultPointColor3D: '#FCDC00',
    pointSize3D: 10,
    pointWeight3D: 1,
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
        case 'SETTINGS_UPDATE_DEFAULT_COLOR_2D': {
            return {
                ...state,
                defaultPointColor2D: action.payload.color
            };
        }
        case 'SETTINGS_UPDATE_POINTSIZE_2D': {
            return {
                ...state,
                pointSize2D: action.payload.pointSize
            };
        }
        case 'SETTINGS_UPDATE_POINTWEIGHT_2D': {
            return {
                ...state,
                pointWeight2D: action.payload.pointWeight
            };
        }
        case 'SETTINGS_UPDATE_DEFAULT_COLOR_3D': {
            return {
                ...state,
                defaultPointColor3D: action.payload.color
            };
        }
        case 'SETTINGS_UPDATE_POINTSIZE_3D': {
            return {
                ...state,
                pointSize3D: action.payload.pointSize
            };
        }
        case 'SETTINGS_UPDATE_POINTWEIGHT_3D': {
            return {
                ...state,
                pointWeight3D: action.payload.pointWeight
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
