import reducer, { defaultReducer, initialState }
    from "../../../src/frontend/redux/points/reducers/points3D.reducer"
import { actions } from "../../../src/frontend/redux"

describe('view3D default reducer', ()=> {
    it('should return the initial state', () => {
        expect(defaultReducer(undefined, {})).toEqual(initialState);
    });

    it('should put didChange to false', () => {
        const state = {
            ...initialState,
            didChange: true
        };
        expect(defaultReducer(state, {})).toEqual(initialState);
    });
});

describe('view3D reducer', () => {

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle 3D_POINT_ADD', () => {
        const action1 = actions.add3DPoint({
        	x: 0.1, 
        	y: 0.5, 
        	z: 3, 
        	name: 'point1'
        });
        const action2 = actions.add3DPoint({
        	x: 0.5, 
        	y: 0.1, 
        	z: 5
        });
        const state = reducer(reducer(initialState, action1), action2);

        expect(state.didChange).toEqual(true);
        expect(state.list.length).toEqual(2);
        const firstPoint = state.list[0];
        const secondPoint = state.list[1];

        expect(firstPoint.x).toEqual(0.1);
        expect(firstPoint.y).toEqual(0.5);
        expect(firstPoint.z).toEqual(3);
        expect(firstPoint.name).toEqual('point1');
        expect(firstPoint.selected).toEqual(true);
        expect(typeof firstPoint.id).toEqual('string');

        expect(secondPoint.x).toEqual(0.5);
        expect(secondPoint.y).toEqual(0.1);
        expect(secondPoint.z).toEqual(5);
        expect(secondPoint.name).toEqual(undefined);
        expect(secondPoint.selected).toEqual(true);
        expect(typeof secondPoint.id).toEqual('string');
    });


    it('should handle 3D_POINT_REMOVE', () => {
    	const action1 = actions.add3DPoint({
        	x: 0.1, 
        	y: 0.5, 
        	z: 3, 
        	name: 'point1'
        });
        const action2 = actions.add3DPoint({
        	x: 0.5, 
        	y: 0.1, 
        	z: 5,
        	name: 'point2'
        });
    	const state = reducer(reducer(initialState, action1), action2);
    	const id1 = state.list[0].id;
    	const id2 = state.list[1].id;

    	const action3 = actions.remove3DPoint(id2);
    	const result = reducer(state, action3);
        expect(result.didChange).toEqual(true);
        expect(result.list).toEqual([state.list[0]]);
    });

    it('should handle 3D_POINT_UPDATE', () => {
    	const action1 = actions.add3DPoint({
        	x: 0.1, 
        	y: 0.5, 
        	z: 3, 
        	name: 'point1'
        });
        const action2 = actions.add3DPoint({
        	x: 0.5, 
        	y: 0.1, 
        	z: 5,
        	name: 'point2'
        });
    	const state = reducer(reducer(initialState, action1), action2);
    	const id1 = state.list[0].id;
    	const id2 = state.list[1].id;

    	const action3 = actions.update3DPoint(id2, {
    		x: 0.6, 
    		y: 0.6, 
    		z: 6, 
    		name: 'point2-updated'
    	});
    	const state2 = reducer(state, action3);
        expect(state2.didChange).toEqual(true);

    	const firstPoint = state2.list[0];
        const secondPoint = state2.list[1];

        expect(firstPoint.x).toEqual(0.1);
        expect(firstPoint.y).toEqual(0.5);
        expect(firstPoint.z).toEqual(3);
        expect(firstPoint.name).toEqual('point1');
        expect(firstPoint.selected).toEqual(true);
        expect(typeof firstPoint.id).toEqual('string');

        expect(secondPoint.x).toEqual(0.6);
        expect(secondPoint.y).toEqual(0.6);
        expect(secondPoint.z).toEqual(6);
        expect(secondPoint.name).toEqual('point2-updated');
        expect(secondPoint.selected).toEqual(true);
        expect(typeof secondPoint.id).toEqual('string');
    });

    it('should handle 3D_POINT_TOGGLE_SELECT', () => {
    	const action1 = actions.add3DPoint({
        	x: 0.1, 
        	y: 0.5, 
        	z: 3, 
        	name: 'point1'
        });
        const action2 = actions.add3DPoint({
        	x: 0.5, 
        	y: 0.1, 
        	z: 5,
        	name: 'point2'
        });
    	const state = reducer(reducer(initialState, action1), action2);
    	const id1 = state.list[0].id;
    	const id2 = state.list[1].id;

    	const action3 = actions.toggle3DPointSelection(id2);
    	const state2 = reducer(state, action3);
        expect(state2.didChange).toEqual(true);

    	const firstPoint = state2.list[0];
        const secondPoint = state2.list[1];

        expect(firstPoint.x).toEqual(0.1);
        expect(firstPoint.y).toEqual(0.5);
        expect(firstPoint.z).toEqual(3);
        expect(firstPoint.name).toEqual('point1');
        expect(firstPoint.selected).toEqual(false);
        expect(typeof firstPoint.id).toEqual('string');

        expect(secondPoint.x).toEqual(0.5);
        expect(secondPoint.y).toEqual(0.1);
        expect(secondPoint.z).toEqual(5);
        expect(secondPoint.name).toEqual('point2');
        expect(secondPoint.selected).toEqual(false);
        expect(typeof secondPoint.id).toEqual('string');
    });
});