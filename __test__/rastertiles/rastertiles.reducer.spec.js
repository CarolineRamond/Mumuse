import reducer, { initialState }
	from "../../src/frontend/modules/rastertiles/rastertiles.reducer"
import { actions } from "../../src/frontend/modules"

const rastertilesets = [{
	bounds: [36.30007802124635, 33.50492356207882, 36.30869103984678, 33.51256955798446],
	date: new Date(),
	maxzoom: 24,
	minzoom: 9,
	priority: 1000,
	name: "Damascus historical center",
	precision: 0.1,
	tileSize: 128,
	_id: "57fc94951af5a68c45e6811f"
}, {
	bounds: [43.22349441788488, 36.503782031163446, 43.233221640104894, 36.51518534690497],
	date: new Date(),
	name: "Dur-Sharrukin",
	precision: 0.04,
	_id: "57fc94951af5a68c45e68120"
}];

const rasterLayers = {
	"57fc94951af5a68c45e6811f-layer": {
		id: "57fc94951af5a68c45e6811f-layer",
		type: "raster",
		source: "57fc94951af5a68c45e6811f-source",
		minzoom: 9,
		maxzoom: 24,
		layout: {
			visibility: "visible"
		},
		metadata: {
			name: "Damascus historical center",
			bounds: [36.30007802124635, 33.50492356207882, 36.30869103984678, 33.51256955798446],
			isShown: true,
			isInBounds: false,
			priority: 1000
		}
	},
	"57fc94951af5a68c45e68120-layer": {
		id: "57fc94951af5a68c45e68120-layer",
		type: "raster",
		source: "57fc94951af5a68c45e68120-source",
		minzoom: 10,
		maxzoom: 22,
		layout: {
			visibility: "visible"
		},
		metadata: {
			name: "Dur-Sharrukin",
			bounds: [43.22349441788488, 36.503782031163446, 43.233221640104894, 36.51518534690497],
			isShown: true,
			isInBounds: false,
			priority: 0
		}
	}
}
const rasterSources = {
	"57fc94951af5a68c45e6811f-source": {
		type: "raster",
		tiles: ['http://localhost:8081/map/rastertile/57fc94951af5a68c45e6811f/{z}/{x}/{y}.pbf'],
		tileSize: 128,
		minzoom: 9,
		maxzoom: 24,
		bounds: [36.30007802124635, 33.50492356207882, 36.30869103984678, 33.51256955798446],
	},
	"57fc94951af5a68c45e68120-source": {
		type: "raster",
		tiles: ['http://localhost:8081/map/rastertile/57fc94951af5a68c45e68120/{z}/{x}/{y}.pbf'],
		tileSize: 256,
		minzoom: 10,
		maxzoom: 22,
		bounds: [43.22349441788488, 36.503782031163446, 43.233221640104894, 36.51518534690497],
	}
};

describe('rastertiles reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should handle FETCH_RASTERTILESETS_PENDING', ()=> {
		const action = {
			type: "FETCH_RASTERTILESETS_PENDING"
		};
		expect(reducer(initialState, action)).toEqual({
			pending: true,
			error: null,
			layers: null,
			sources: null
		});
	});

	it('should handle FETCH_RASTERTILESETS_FULFILLED (empty tilesets)', ()=> {
		const action = {
			type: "FETCH_RASTERTILESETS_FULFILLED",
			payload: {
				data: []
			}
		};
		expect(reducer(initialState, action)).toEqual({
			pending: false,
			error: null,
			layers: {},
			sources: {}
		});
	});

	it('should handle FETCH_RASTERTILESETS_FULFILLED', ()=> {
		const action = {
			type: "FETCH_RASTERTILESETS_FULFILLED",
			payload: {
				data: rastertilesets
			}
		};
		expect(reducer(initialState, action)).toEqual({
			pending: false,
			error: null,
			layers: rasterLayers,
			sources: rasterSources
		});
	});

	it('should handle FETCH_RASTERTILESETS_REJECTED (with response message)', ()=> {
		const action = {
			type: "FETCH_RASTERTILESETS_REJECTED",
			payload: {
				response: {
					data: { message: "Your session has expired" },
					status: 401,
					statusText: "Unauthorized"
				}
			}
		}
		expect(reducer(initialState, action)).toEqual({
			pending: false,
			error: 'Error 401 (Unauthorized) : Your session has expired',
			layers: null,
			sources: null
		});
	});

	it('should handle FETCH_RASTERTILESETS_REJECTED (without response message)', ()=> {
		const action = {
			type: "FETCH_RASTERTILESETS_REJECTED",
			payload: {
				response: {
					data: null,
					status: 401,
					statusText: "Unauthorized"
				}
			}
		}
		expect(reducer(initialState, action)).toEqual({
			pending: false,
			error: 'Error 401 (Unauthorized)',
			layers: null,
			sources: null
		});
	});

	describe('on TOGGLE_LAYER', ()=> {
		it('should do nothing when layerId is not in rastertilesets ids', ()=> {
			const action1 = {
				type: "FETCH_RASTERTILESETS_FULFILLED",
				payload: {
					data: rastertilesets
				}
			};
			const state = reducer(initialState, action1);
			const action2 = actions.toggleLayer({ layerId: "anything" });
			expect(reducer(state, action2)).toEqual(state);
		})

		it('should do nothing when layerId is not in rastertilesets ids', ()=> {
			const action1 = {
				type: "FETCH_RASTERTILESETS_FULFILLED",
				payload: {
					data: rastertilesets
				}
			};
			const state = reducer(initialState, action1);
			const action2 = actions.toggleLayer({ layerId: "57fc94951af5a68c45e68120-layer" });
			expect(reducer(state, action2)).toEqual({
				...state,
				layers: {
					...state.layers,
					"57fc94951af5a68c45e68120-layer": {
						...state.layers["57fc94951af5a68c45e68120-layer"],
						layout: {
							visibility: "none"
						},
						metadata: {
							...state.layers["57fc94951af5a68c45e68120-layer"].metadata,
							isShown: false,
							didChange: { layout: { visibility: "none" } }
						}
					}
				}
			});
		});

		it('should handle two consecutive toggles', ()=> {
			const action1 = {
				type: "FETCH_RASTERTILESETS_FULFILLED",
				payload: {
					data: rastertilesets
				}
			};
			const state = reducer(initialState, action1);
			const action2 = actions.toggleLayer({ layerId: "57fc94951af5a68c45e68120-layer" });
			const action3 = actions.toggleLayer({ layerId: "57fc94951af5a68c45e68120-layer" });
			const test = reducer(
				reducer(state, action2),
				action3
			);
			expect(test).toEqual({
				...state,
				layers: {
					...state.layers,
					"57fc94951af5a68c45e68120-layer": {
						...state.layers["57fc94951af5a68c45e68120-layer"],
						metadata: {
							...state.layers["57fc94951af5a68c45e68120-layer"].metadata,
							didChange: { layout: { visibility: "visible" } }
						}
					}
				}
			});
		});
	});

	describe('on UPDATE_WORLD_STATE', ()=> {
		it('should update layers\' isInBounds property', ()=> {
			const action1 = {
				type: "FETCH_RASTERTILESETS_FULFILLED",
				payload: {
					data: rastertilesets
				}
			};
			const state = reducer(initialState, action1);
			const action2 = {
				type: "UPDATE_WORLD_STATE",
				payload: {
					lat: -8.554271804972444,
					lng: 69.49229911537657,
					zoom: 3,
					bounds: [26.899178061222386, 109.63670788661244, -41.068905392363035, 29.34789034412097]
				}
			}
			expect(reducer(state, action2)).toEqual({
				...state,
				layers: {
					...state.layers,
					"57fc94951af5a68c45e68120-layer": {
						...state.layers["57fc94951af5a68c45e68120-layer"],
						metadata: {
							...state.layers["57fc94951af5a68c45e68120-layer"].metadata,
							isInBounds: false
						}
					},
					"57fc94951af5a68c45e6811f-layer": {
						...state.layers["57fc94951af5a68c45e6811f-layer"],
						metadata: {
							...state.layers["57fc94951af5a68c45e6811f-layer"].metadata,
							isInBounds: false
						}
					}
				}
			});
			const action3 = {
				type: "UPDATE_WORLD_STATE",
				payload: {
					lat: 33.44511703733343,
					lng: 36.42492614095019,
					zoom: 6,
					bounds: [30.812644362611564, 29.08133636606371, 42.037207919248885, 37.59997976449702]
				}
			}
			expect(reducer(state, action3)).toEqual({
				...state,
				layers: {
					...state.layers,
					"57fc94951af5a68c45e68120-layer": {
						...state.layers["57fc94951af5a68c45e68120-layer"],
						metadata: {
							...state.layers["57fc94951af5a68c45e68120-layer"].metadata,
							isInBounds: false
						}
					},
					"57fc94951af5a68c45e6811f-layer": {
						...state.layers["57fc94951af5a68c45e6811f-layer"],
						metadata: {
							...state.layers["57fc94951af5a68c45e6811f-layer"].metadata,
							isInBounds: true
						}
					}
				}
			});
		});
	});
});