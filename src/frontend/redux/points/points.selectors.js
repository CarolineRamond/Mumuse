export const get2DPoints = state => {
    return state.present.points2D.list;
};

export const shouldRedraw2DPoints = state => {
    return state.shouldRedraw2D;
};

export const get3DPoints = state => {
    return state.present.points3D.list;
};

export const shouldRedraw3DPoints = state => {
    return state.shouldRedraw3D;
};

export const getBindings = state => {
    return state.present.bindings.list.map(binding => {
        return {
            point2D: state.present.points2D.list.find(item => {
                return item.id === binding.pointId2D;
            }),
            point3D: state.present.points3D.list.find(item => {
                return item.id === binding.pointId3D;
            }),
            selected: binding.selected
        };
    });
};

export const getBindingBuffer2D = state => {
    return state.present.bindings.buffer2D;
};

export const getBindingBuffer3D = state => {
    return state.present.bindings.buffer3D;
};

export const canUndo = state => {
    return state.past.length > 0;
};

export const canRedo = state => {
    return state.future.length > 0;
};
