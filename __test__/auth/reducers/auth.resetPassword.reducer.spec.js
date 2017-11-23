import reducer, { initialState }
	from "../../../src/frontend/modules/auth/reducers/auth.resetPassword.reducer"
import { actions } from "../../../src/frontend/modules"

describe('auth login reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle RESET_PASSWORD_PENDING', ()=> {
	  	const action = {
	  		type: "RESET_PASSWORD_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle RESET_PASSWORD_FULFILLED', ()=> {
	  	const action = {
	  		type: "RESET_PASSWORD_FULFILLED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: "Success : Your password was successfully reset.",
	  		error: null
	  	});
  	});

  	it('should handle RESET_PASSWORD_REJECTED', ()=> {
	  	const action = {
	  		type: "RESET_PASSWORD_REJECTED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error resetting your password. Please try again later."
	  	});
  	});
});