import { combineReducers } from "redux";
import { forIn } from "lodash";

import auth from "./auth";
import medias from "./medias";
import rastertiles from "./rastertiles";
import users from "./users";
import world from "./world";

const modules = [auth, medias, rastertiles, users, world];

// reducer 
// (combination of all modules' reducers)
const reducer = combineReducers({
	world: world.reducer,
	medias: medias.reducer,
	auth: auth.reducer,
	users: users.reducer,
	rastertiles: rastertiles.reducer
});

// selectors
// all exposed selectors take full store as argument
// => if "medias" module has selector "getSelectedMedias",
// the exposed selector will be :
// (store)=> { return getSelectedMedias(store.medias) }
var selectors = modules.reduce((result, module)=> {
	forIn(module.selectors, (selector)=> {
		if (selector.name !== "getLayersState" && selector.name !== "getSourcesState") {
			result[selector.name] = (store)=> {
				return selector(store[module.name]);
			};
		}
	});
	return result;
}, {});

// getLayersState : a selector that gather and return
// all the layersState from all modules, ie :
// getLayersState = (store) => { 
// 		return merge(medias.getLayersState(store.medias), raster.getLayersState(store.raster))
// }
const getLayersState = (state)=> {
	const layersState = modules.reduce((result, module)=> {
		if (module.selectors["getLayersState"]) {
			const moduleResult = module.selectors["getLayersState"](state[module.name]);
			result.pending = result.pending || moduleResult.pending;
			// result.error = TODO
			if (result.data && moduleResult.data) {
				result.data = Object.assign({}, result.data, moduleResult.data)
			} else if (!result.data && moduleResult.data) {
				result.data = moduleResult.data;
			}
		}
		return result;
	}, { pending: false, error: null, data: null });
	return layersState;
}

// getSourcesState : a selector that gather and return
// all the sourcesState from all modules, ie :
// getSourcesState = (store) => { 
// 		return merge(medias.getLayersState(store.medias), raster.getLayersState(store.raster))
// }
const getSourcesState = (state)=> {
	const sourcesState = modules.reduce((result, module)=> {
		if (module.selectors["getSourcesState"]) {
			const moduleResult = module.selectors["getSourcesState"](state[module.name]);
			result.pending = result.pending || moduleResult.pending;
			// result.error = TODO
			if (result.data && moduleResult.data) {
				result.data = Object.assign({}, result.data, moduleResult.data)
			} else if (!result.data && moduleResult.data) {
				result.data = moduleResult.data;
			}
		}
		return result;
	}, { pending: false, error: null, data: null });
	return sourcesState;
}

// expose getLayersState & getSourcesState as selectors
selectors["getSourcesState"] = getSourcesState;
selectors["getLayersState"] = getLayersState;

// actions
const actions = modules.reduce((result, module)=> {
	forIn(module.actions, (action)=> {
		result[action.name] = action;
	});
	return result;
}, {});

// map config : combination of all modules' map configs
// => mapConfig = merge(media.mapConfig, world.mapConfig, etc)
const mapConfig = modules.reduce((result, module)=> {
	if (module.mapConfig) {
		result.events = module.mapConfig.events.concat(result.events);
		result.click = module.mapConfig.click.concat(result.click);
		result.dragndrop = module.mapConfig.dragndrop.concat(result.dragndrop);
		result.renderedFeatures = module.mapConfig.renderedFeatures.concat(result.renderedFeatures);
	}
	return result;
}, { events: [], click: [], dragndrop: [], renderedFeatures: [] });


export default reducer;
export { selectors, actions, mapConfig }
