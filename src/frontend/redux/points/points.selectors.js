export const get2DPoints = state => {
    return state.present.points2D.list;
};

export const did2DPointsChange = state => {
    return state.present.points2D.didChange;
};

export const get3DPoints = state => {
    return state.present.points3D.list;
};

export const did3DPointsChange = state => {
    return state.present.points3D.didChange;
};

export const getBindings = state => {
    return state.present.bindings;
};
