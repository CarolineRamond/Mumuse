import uuid from 'uuid/v1';

export const initialState = {
    didChange: false,
    list: []
};

export const defaultReducer = (state = initialState) => {
    return {
        ...state,
        didChange: false
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case '2D_POINT_ADD': {
            const newPoint = {
                x: action.payload.x,
                y: action.payload.y,
                name: action.payload.name,
                id: uuid(),
                selected: false
            };
            return {
                ...state,
                list: state.list.concat([newPoint]),
                didChange: true
            };
        }
        case '2D_POINT_REMOVE': {
            const newList = state.list.filter(point => {
                return point.id !== action.payload.pointId;
            });
            return {
                ...state,
                list: newList,
                didChange: true
            };
        }
        case '2D_POINT_UPDATE': {
            const newList = state.list.map(point => {
                if (point.id === action.payload.pointId) {
                    return {
                        ...point,
                        x: action.payload.x,
                        y: action.payload.y,
                        name: action.payload.name || point.name
                    };
                } else {
                    return point;
                }
            });
            return {
                ...state,
                list: newList,
                didChange: true
            };
        }
        // case '2D_POINT_TOGGLE_SELECT': {
        //     const newList = state.list.map(point => {
        //         if (point.id === action.payload.pointId) {
        //             return {
        //                 ...point,
        //                 selected: !point.selected
        //             };
        //         } else {
        //             return {
        //                 ...point,
        //                 selected: false
        //             };
        //         }
        //     });
        //     return {
        //         ...state,
        //         list: newList,
        //         didChange: true
        //     };
        // }
        case '2D_POINT_SELECT': {
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
                didChange: true
            };
        }
        default:
            return defaultReducer(state);
    }
};

export default reducer;
