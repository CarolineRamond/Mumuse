export const toggleAddMode = () => {
    return {
        type: 'SETTINGS_TOGGLE_ADD_MODE'
    };
};

export const toggleBindMode = () => {
    return {
        type: 'SETTINGS_TOGGLE_BIND_MODE'
    };
};

export const toggleDeleteMode = () => {
    return {
        type: 'SETTINGS_TOGGLE_DELETE_MODE'
    };
};

export const resetMode = () => {
    return {
        type: 'SETTINGS_RESET_MODE'
    };
};

export const updateDefaultPointColor = color => {
    return {
        type: 'SETTINGS_UPDATE_DEFAULT_COLOR',
        payload: {
            color: color
        },
        meta: {
            validator: {
                color: {
                    func: _color => {
                        return typeof _color === 'string';
                    },
                    msg: 'color must be a string'
                }
            }
        }
    };
};

export const updateDefaultPointSize = pointSize => {
    return {
        type: 'SETTINGS_UPDATE_POINTSIZE',
        payload: {
            pointSize: pointSize
        },
        meta: {
            validator: {
                pointSize: {
                    func: _pointSize => {
                        return typeof _pointSize === 'number';
                    },
                    msg: 'pointSize must be a number'
                }
            }
        }
    };
};

export const toggleModelTexture = () => {
    return {
        type: 'SETTINGS_TOGGLE_MODEL_TEXTURE'
    };
};
