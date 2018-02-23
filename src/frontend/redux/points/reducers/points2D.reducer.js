import uuid from 'uuid/v1';

export const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case '2D_POINT_ADD': {
            const newPoint = {
                x: action.payload.x,
                y: action.payload.y,
                name: action.payload.name,
                id: uuid(),
                selected: true
            };
            return state.concat([newPoint]);
        }
        case '2D_POINT_REMOVE': {
            return state.filter(point => {
                return point.id !== action.payload.pointId;
            });
        }
        case '2D_POINT_UPDATE': {
            return state.map(point => {
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
        }
        case '2D_POINT_TOGGLE_SELECT': {
            return state.map(point => {
                if (point.id === action.payload.pointId) {
                    return {
                        ...point,
                        selected: !point.selected
                    };
                } else {
                    return {
                        ...point,
                        selected: false
                    };
                }
            });
        }
        default:
            return state;
    }
};

export default reducer;
