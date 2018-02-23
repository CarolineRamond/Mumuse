import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import bindingsReducer from './reducers/bindings.reducer';
import points2DReducer from './reducers/points2D.reducer';
import points3DReducer from './reducers/points3D.reducer';

const reducer = combineReducers({
    bindings: bindingsReducer,
    points2D: points2DReducer,
    points3D: points3DReducer
});

export default undoable(reducer);
