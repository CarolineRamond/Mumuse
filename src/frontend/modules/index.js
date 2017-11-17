import { combineReducers } from "redux";
import { forIn } from "lodash";

export const getLayersState = (state)=> {
	if (state.rastertiles.pending) {
		return { 
			pending: true,
			error: null,
			data: null
		}
	} else if (state.rastertiles.error) {
		return {
			pending: false,
			error: state.rastertiles.error,
			data: state.medias.layers
		}
	} else {
		return {
			pending: false,
			error: null,
			data: Object.assign({}, state.rastertiles.layers, state.medias.layers)
		}
	}
}

export const getSourcesState = (state)=> {
	if (state.rastertiles.pending) {
		return { 
			pending: true,
			error: null,
			data: null
		}
	} else if (state.rastertiles.error) {
		return {
			pending: false,
			error: state.rastertiles.error,
			data: state.medias.sources
		}
	} else {
		return {
			pending: false,
			error: null,
			data: Object.assign({}, state.rastertiles.sources, state.medias.sources)
		}
	}
}

import auth from "./auth";
import medias from "./medias";
import rastertiles from "./rasterTiles";
import users from "./users";
import world from "./world";

const modules = [auth, medias, rastertiles, users, world];

const reducer = combineReducers({
	world: world.reducer,
	medias: medias.reducer,
	auth: auth.reducer,
	users: users.reducer,
	rastertiles: rastertiles.reducer
});

const selectors = modules.reduce((result, module)=> {
	forIn(module.selectors, (selector)=> {
		result[selector.name] = (store)=> {
			return selector(store[module.name]);
		};
	});
	return result;
}, {});

const actions = modules.reduce((result, module)=> {
	forIn(module.actions, (action)=> {
		result[action.name] = action;
	});
	return result;
}, {});

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
