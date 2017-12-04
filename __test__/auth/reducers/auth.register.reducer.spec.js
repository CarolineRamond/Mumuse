import reducer, { initialState }
	from "../../../src/frontend/modules/auth/reducers/auth.register.reducer"
import { actions } from "../../../src/frontend/modules"

describe('auth register reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle REGISTER_PENDING', ()=> {
	  	const action = {
	  		type: "REGISTER_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle REGISTER_FULFILLED', ()=> {
	  	const action = {
	  		type: "REGISTER_FULFILLED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: "Your account was successfully created. Please check your emails to validate it.",
	  		error: null
	  	});
  	});

  	it('should handle REGISTER_REJECTED', ()=> {
	  	const action = {
	  		type: "REGISTER_REJECTED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error creating your account. Please try again later."
	  	});
  	});

  	it('should handle REGISTER_RESET', ()=> {
	  	const action = {
	  		type: "REGISTER_RESET"
	  	};
	  	const state = {
	  		pending: false,
	  		error: "Error",
	  		data: null
	  	};
	  	expect(reducer(state, action)).toEqual(initialState);
  	});
});