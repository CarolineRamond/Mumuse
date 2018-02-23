import { combineReducers } from 'redux';
import { forIn } from 'lodash';

import calc from './calc';
import points from './points';

const modules = [calc, points];

// reducer
// (combination of all modules' reducers)
const reducer = combineReducers({
    calc: calc.reducer,
    points: points.reducer
});

// selectors
// all exposed selectors take full store as argument
// => if 'medias' module has selector 'getSelectedMedias',
// the exposed selector will be :
// (store)=> { return getSelectedMedias(store.medias) }
const selectors = modules.reduce((result, module) => {
    forIn(module.selectors, selector => {
        result[selector.name] = store => {
            return selector(store[module.name]);
        };
    });
    return result;
}, {});

// actions
const actions = modules.reduce((result, module) => {
    forIn(module.actions, action => {
        result[action.name] = action;
    });
    return result;
}, {});

export default reducer;
export { selectors, actions };
