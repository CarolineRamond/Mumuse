export const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'BINDING_ADD': {
            const newBinding = {
                pointId2D: action.payload.pointId2D,
                pointId3D: action.payload.pointId3D,
                color: '#ff0000'
            };
            return state.concat([newBinding]);
        }
        case 'BINDING_REMOVE_BY_2D': {
            return state.filter(binding => {
                return binding.pointId2D !== action.payload.pointId2D;
            });
        }
        case 'BINDING_REMOVE_BY_3D': {
            return state.filter(binding => {
                return binding.pointId3D !== action.payload.pointId3D;
            });
        }
        case '2D_POINT_REMOVE': {
            return state.filter(binding => {
                return binding.pointId2D !== action.payload.pointId;
            });
        }
        case '3D_POINT_REMOVE': {
            return state.filter(binding => {
                return binding.pointId3D !== action.payload.pointId;
            });
        }
        default:
            return state;
    }
};

export default reducer;
