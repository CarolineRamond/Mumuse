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
                pointId3D: action.payload.pointId3D
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
                return binding.pointId2D !== action.payload.pointId2D;
            });
            return {
                ...state,
                list: newList
            };
        }
        case 'BINDING_REMOVE_BY_3D': {
            const newList = state.list.filter(binding => {
                return binding.pointId3D !== action.payload.pointId3D;
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
            return {
                ...state,
                list: newList
            };
        }
        case '3D_POINT_REMOVE': {
            const newList = state.list.filter(binding => {
                return binding.pointId3D !== action.payload.pointId;
            });
            return {
                ...state,
                list: newList
            };
        }
        case 'BINDING_BUFFER_ADD_2D': {
            return {
                ...state,
                buffer2D: action.payload.point2D
            };
        }
        case 'BINDING_BUFFER_ADD_3D': {
            return {
                ...state,
                buffer3D: action.payload.point3D
            };
        }
        default:
            return state;
    }
};

export default reducer;
