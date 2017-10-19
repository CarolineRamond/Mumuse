import { combineReducers } from "redux";
import worldReducer from './world.reducer.js';
import mediasReducer from './medias.reducer.js';
import sitesReducer from './sites.reducer.js';

const defaultReducer = (state={},action)=> {
	return state;
}

const reducer = combineReducers({
	world: worldReducer,
	medias: mediasReducer,
	sites: sitesReducer
});
export default reducer;