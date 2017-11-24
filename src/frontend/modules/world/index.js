import reducer from './world.reducer';
import * as selectors from './world.selectors';
import * as actions from './world.actions';
import mapConfig from './world.map.config';

export default { name: "world", reducer, selectors, actions, mapConfig };
