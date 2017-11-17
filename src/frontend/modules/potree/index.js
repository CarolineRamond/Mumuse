import { combineReducers } from 'redux';

import camerasReducer from './reducers/potree.reducer';
import potreeMapConfig from './potree.map.config';

const potreeReducer = combineReducers({
  camerasParameters: camerasReducer
});

// default export : reducer function
export default potreeReducer;

// export potreeMapConfig
export { potreeMapConfig };