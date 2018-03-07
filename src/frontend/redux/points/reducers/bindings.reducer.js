export const initialState = {
    list: [],
    buffer2D: null,
    buffer3D: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'BINDING_ADD': {
            const newList = state.list.filter(binding => {
                return (
                    binding.pointId2D !== action.payload.pointId2D &&
                    binding.pointId3D !== action.payload.pointId3D
                );
            });
            const newBinding = {
                pointId2D: action.payload.pointId2D,
                pointId3D: action.payload.pointId3D,
                selected: false
            };
            return {
                ...state,
                list: [newBinding].concat(newList),
                buffer2D: null,
                buffer3D: null
            };
        }
        case 'BINDING_REMOVE_BY_2D': {
            const newList = state.list.filter(binding => {
                return binding.pointId2D !== action.payload.pointId;
            });
            return {
                ...state,
                list: newList
            };
        }
        case 'BINDING_REMOVE_BY_3D': {
            const newList = state.list.filter(binding => {
                return binding.pointId3D !== action.payload.pointId;
            });
            return {
                ...state,
                list: newList
            };
        }
        case '2D_POINT_REMOVE': {
            const newList = state.list.filter(binding => {
                return binding.pointId2D !== action.payload.pointId;
            });
            let newBuffer2D = state.buffer2D;
            if (action.payload.pointId === newBuffer2D.id) {
                newBuffer2D = null;
            }
            return {
                ...state,
                buffer2D: newBuffer2D,
                list: newList
            };
        }
        case '3D_POINT_REMOVE': {
            const newList = state.list.filter(binding => {
                return binding.pointId3D !== action.payload.pointId;
            });
            let newBuffer3D = state.buffer3D;
            if (action.payload.pointId === newBuffer3D.id) {
                newBuffer3D = null;
            }
            return {
                ...state,
                buffer3D: newBuffer3D,
                list: newList
            };
        }
        case 'BINDING_BUFFER_ADD_2D': {
            return {
                ...state,
                buffer2D: action.payload.point
            };
        }
        case 'BINDING_BUFFER_ADD_3D': {
            return {
                ...state,
                buffer3D: action.payload.point
            };
        }
        case 'BINDING_SELECT':
        case '2D_POINT_SELECT': {
            const pointId2D = action.payload.pointId2D || action.payload.pointId;
            const newList = state.list.map(binding => {
                return {
                    ...binding,
                    selected: binding.pointId2D === pointId2D
                };
            });
            return {
                ...state,
                list: newList
            };
        }
        case '3D_POINT_SELECT': {
            const pointId3D = action.payload.pointId3D || action.payload.pointId;
            const newList = state.list.map(binding => {
                return {
                    ...binding,
                    selected: binding.pointId3D === pointId3D
                };
            });
            return {
                ...state,
                list: newList
            };
        }
        default:
            return state;
    }
};

export default reducer;
