import reducer, { initialState }
	from "../../../src/frontend/modules/auth/reducers/auth.login.reducer"
import { actions } from "../../../src/frontend/modules"

describe('auth login reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle LOGIN_PENDING', ()=> {
	  	const action = {
	  		type: "LOGIN_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle LOGIN_FULFILLED', ()=> {
	  	const action = {
	  		type: "LOGIN_FULFILLED",
	  		payload: {
	  			data: { email: "test@test.com", _id: 3 },
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: { email: "test@test.com", _id: 3 },
	  		error: null
	  	});
  	});

  	it('should handle LOGIN_REJECTED', ()=> {
	  	const action = {
	  		type: "LOGIN_REJECTED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error : Bad username or password."
	  	});
  	});

  	it('should handle LOGIN_RESET', ()=> {
	  	const action = {
	  		type: "LOGIN_RESET"
	  	};
	  	const state = {
	  		pending: false,
	  		error: "Error",
	  		data: null
	  	};
	  	expect(reducer(state, action)).toEqual(initialState);
  	});
});