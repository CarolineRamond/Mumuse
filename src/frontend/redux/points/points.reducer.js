import { combineReducers } from 'redux';
import undoable, { includeAction } from 'redux-undo';
import bindingsReducer from './reducers/bindings.reducer';
import points2DReducer from './reducers/points2D.reducer';
import points3DReducer from './reducers/points3D.reducer';

const reducer = combineReducers({
    bindings: bindingsReducer,
    points2D: points2DReducer,
    points3D: points3DReducer
});

// when dispatched, these actions will create a new entry in state history
const modifyHistoryActions = [
    '2D_POINT_ADD',
    '2D_POINT_REMOVE',
    '2D_POINT_UPDATE',
    '3D_POINT_ADD',
    '3D_POINT_REMOVE',
    '3D_POINT_UPDATE',
    'BINDING_ADD',
    'BINDING_REMOVE_BY_2D',
    'BINDING_REMOVE_BY_3D'
];

export default undoable(reducer, {
    filter: includeAction(modifyHistoryActions)
});
