import reducer, { initialState }
	from "../../../src/frontend/modules/auth/reducers/auth.forgotPassword.reducer"
import { actions } from "../../../src/frontend/modules"

describe('auth forgot password reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle FORGOT_PASSWORD_PENDING', ()=> {
	  	const action = {
	  		type: "FORGOT_PASSWORD_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle FORGOT_PASSWORD_FULFILLED', ()=> {
	  	const action = {
	  		type: "FORGOT_PASSWORD_FULFILLED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: "Success : an email was sent to your address with further instructions.",
	  		error: null
	  	});
  	});

  	it('should handle FORGOT_PASSWORD_REJECTED', ()=> {
	  	const action = {
	  		type: "FORGOT_PASSWORD_REJECTED"
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error retrieving your account. Please try again later."
	  	});
  	});
});