import reducer, { initialState }
	from "../../src/frontend/redux/calc/calc.reducer"
import { actions } from "../../src/frontend/redux"

describe('calc reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});
});