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

export const updateDefaultPointColor2D = color => {
    return {
        type: 'SETTINGS_UPDATE_DEFAULT_COLOR_2D',
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

export const updatePointSize2D = pointSize => {
    return {
        type: 'SETTINGS_UPDATE_POINTSIZE_2D',
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

export const updatePointWeight2D = pointWeight => {
    return {
        type: 'SETTINGS_UPDATE_POINTWEIGHT_2D',
        payload: {
            pointWeight: pointWeight
        },
        meta: {
            validator: {
                pointWeight: {
                    func: _pointWeight => {
                        return typeof _pointWeight === 'number';
                    },
                    msg: 'pointWeight must be a number'
                }
            }
        }
    };
};

export const updateDefaultPointColor3D = color => {
    return {
        type: 'SETTINGS_UPDATE_DEFAULT_COLOR_3D',
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

export const updatePointSize3D = pointSize => {
    return {
        type: 'SETTINGS_UPDATE_POINTSIZE_3D',
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

export const updatePointWeight3D = pointWeight => {
    return {
        type: 'SETTINGS_UPDATE_POINTWEIGHT_3D',
        payload: {
            pointWeight: pointWeight
        },
        meta: {
            validator: {
                pointWeight: {
                    func: _pointWeight => {
                        return typeof _pointWeight === 'number';
                    },
                    msg: 'pointWeight must be a number'
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
