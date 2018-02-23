import reducer, { initialState }
	from "../../../src/frontend/redux/points/reducers/bindings.reducer"
import { actions } from "../../../src/frontend/redux"

describe('bindings reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle BINDING_ADD', ()=> {
	  	const action = actions.addBinding('id2D', 'id3D');
	  	expect(reducer(initialState, action)).toEqual([{
	  		pointId2D: 'id2D',
	  		pointId3D: 'id3D'
	  	}])
  	});

  	it('should handle BINDING_REMOVE_BY_2D', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.removeBindingBy2D('id2D');
	  	expect(reducer(state1, action2)).toEqual([])
  	});

  	it('should handle BINDING_REMOVE_BY_2D (case no matching pointId2D)', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.removeBindingBy2D('id3D');
	  	expect(reducer(state1, action2)).toEqual(state1);
  	});

  	it('should handle BINDING_REMOVE_BY_3D', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.removeBindingBy3D('id3D');
	  	expect(reducer(state1, action2)).toEqual([])
  	});

  	it('should handle BINDING_REMOVE_BY_3D (case no matching pointId3D)', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.removeBindingBy3D('id2D');
	  	expect(reducer(state1, action2)).toEqual(state1);
  	});

  	it('should handle 2D_POINT_REMOVE', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.remove2DPoint('id2D');
	  	expect(reducer(state1, action2)).toEqual([]);
  	});

  	it('should handle 2D_POINT_REMOVE (case no matching pointId2D', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.remove2DPoint('id3D');
	  	expect(reducer(state1, action2)).toEqual(state1);
  	});

  	it('should handle 3D_POINT_REMOVE', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.remove3DPoint('id3D');
	  	expect(reducer(state1, action2)).toEqual([]);
  	});

  	it('should handle 3D_POINT_REMOVE (case no matching pointId3D', ()=> {
	  	const action1 = actions.addBinding('id2D', 'id3D');
	  	const state1 = reducer(initialState, action1);

	  	const action2 = actions.remove3DPoint('id2D');
	  	expect(reducer(state1, action2)).toEqual(state1);
  	});
});