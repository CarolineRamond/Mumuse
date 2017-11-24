import reducer, { defaultReducer, initialState }
	from "../../src/frontend/modules/world/world.reducer"
import { actions } from "../../src/frontend/modules"

describe('world reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	describe('on UPDATE_WORLD_STATE', ()=> {
		it('should update map\'s data (lat, lng, bounds, etc)', ()=> {
			const action = {
				type: "UPDATE_WORLD_STATE",
				payload: {
					lat: 40,
					lng: 40,
					zoom: 8,
					bounds: [44, 30, 45, 31]
				}
			};
			expect(reducer(initialState, action)).toEqual({
				lat: 40,
				lng: 40,
				zoom: 8,
				bounds: [44, 30, 45, 31],
				previewMode: false,
				shouldMapResize: false
			});
		});
	});

	describe('on RESIZE_MAP', ()=> {
		it('should ask for map resize (by setting shouldMapResize)', ()=> {
			const action = actions.resizeMap();
			expect(reducer(initialState, action)).toEqual({
				...initialState,
				shouldMapResize: true
			});
		});
	});

	describe('on SWITCH_PREVIEW_MODE', ()=> {
		it('should switch previewMode and ask for map resize (by setting shouldMapResize)', ()=> {
			const action = actions.switchPreviewMode();
			expect(reducer(initialState, action)).toEqual({
				...initialState,
				previewMode: true,
				shouldMapResize: true
			});
		});
	});

});