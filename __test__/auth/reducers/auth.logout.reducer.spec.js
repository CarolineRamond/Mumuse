import reducer, { initialState }
	from "../../../src/frontend/modules/auth/reducers/auth.logout.reducer"
import { actions } from "../../../src/frontend/modules"

describe('auth login reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle LOGOUT_PENDING', ()=> {
	  	const action = {
	  		type: "LOGOUT_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle LOGOUT_FULFILLED', ()=> {
	  	const action = {
	  		type: "LOGOUT_FULFILLED",
	  		payload: {
	  			data: { message: "Good bye" },
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: { message: "Good bye" },
	  		error: null
	  	});
  	});

  	it('should handle LOGOUT_REJECTED (without response message)', ()=> {
	  	const action = {
	  		type: "LOGOUT_REJECTED",
	  		payload: {
	  			response: {
	  				data: "Error occured while trying to proxy to: localhost:8080/userdrive/auth/logout",
	  				status: 504,
	  				statusText: "Gateway Timeout"
	  			}
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error 504 (Gateway Timeout)"
	  	});
  	});

  	it('should handle LOGOUT_REJECTED (with response message)', ()=> {
	  	const action = {
	  		type: "LOGOUT_REJECTED",
	  		payload: {
	  			response: {
	  				data: { message: 'Your session has expired' },
	  				status: 401,
	  				statusText: 'Unauthorized'
	  			}
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: null,
	  		error: "Error 401 (Unauthorized) : Your session has expired"
	  	});
  	});
});