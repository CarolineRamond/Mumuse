import uuid from 'uuid/v1';

export const initialState = {
    shouldRedraw: false,
    list: []
};

export const defaultReducer = (state = initialState) => {
    return {
        ...state,
        shouldRedraw: false
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case '3D_POINT_ADD': {
            const newPoint = {
                x: action.payload.x,
                y: action.payload.y,
                z: action.payload.z,
                name: action.payload.name || `point3D-${state.list.length + 1}`,
                id: uuid(),
                selected: false,
                bind: null
            };
            return {
                ...state,
                list: [newPoint].concat(state.list),
                shouldRedraw: true
            };
        }
        case '3D_POINT_REMOVE': {
            const newList = state.list.filter(point => {
                return point.id !== action.payload.pointId;
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: true
            };
        }
        case '3D_POINT_UPDATE': {
            const newList = state.list.map(point => {
                if (point.id === action.payload.pointId) {
                    return {
                        ...point,
                        x: action.payload.x || point.x,
                        y: action.payload.y || point.y,
                        z: action.payload.z || point.z,
                        name: action.payload.name || point.name,
                        color: action.payload.color || point.color
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: true
            };
        }
        case '3D_POINT_SELECT': {
            const newList = state.list.map(point => {
                if (point.id === action.payload.pointId) {
                    return {
                        ...point,
                        selected: true
                    };
                } else {
                    return {
                        ...point,
                        selected: false
                    };
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: true
            };
        }
        case 'BINDING_ADD': {
            const newList = state.list.map(point => {
                if (point.id === action.payload.pointId3D) {
                    return {
                        ...point,
                        bind: action.payload.pointId2D
                    };
                } else if (point.bind === action.payload.pointId2D) {
                    return {
                        ...point,
                        bind: null
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: false
            };
        }
        case 'BINDING_REMOVE_BY_2D': {
            const newList = state.list.map(point => {
                if (point.bind === action.payload.pointId2D) {
                    return {
                        ...point,
                        bind: null
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: false
            };
        }
        case 'BINDING_REMOVE_BY_3D': {
            const newList = state.list.map(point => {
                if (point.id === action.payload.pointId3D) {
                    return {
                        ...point,
                        bind: null
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: false
            };
        }
        case '2D_POINT_REMOVE': {
            const newList = state.list.map(point => {
                if (point.bind === action.payload.pointId) {
                    return {
                        ...point,
                        bind: null
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                shouldRedraw: false
            };
        }
        case '2D_POINT_UPDATE': {
            if (action.payload.color) {
                const newList = state.list.map(point => {
                    if (point.bind === action.payload.pointId) {
                        return {
                            ...point,
                            color: action.payload.color
                        };
                    } else {
                        return point;
                    }
                });
                return {
                    ...state,
                    list: newList,
                    shouldRedraw: true
                };
            } else {
                return defaultReducer(state);
            }
        }
        default:
            return defaultReducer(state);
    }
};

export default reducer;
