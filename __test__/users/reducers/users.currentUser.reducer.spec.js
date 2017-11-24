import reducer, { initialState }
	from "../../../src/frontend/modules/users/reducers/users.currentUser.reducer"
import { actions } from "../../../src/frontend/modules"

describe('admin fetch user reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle FETCH_USER_PENDING', ()=> {
	  	const action = {
	  		type: "FETCH_USER_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle FETCH_USER_FULFILLED', ()=> {
	  	const action = {
	  		type: "FETCH_USER_FULFILLED",
	  		payload: {
	  			data: { email: "test@test.com", _id: 1 },
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: { email: "test@test.com", _id: 1 },
	  		error: null
	  	});
  	});

  	it('should handle FETCH_USER_REJECTED (without response message)', ()=> {
	  	const action = {
	  		type: "FETCH_USER_REJECTED",
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

  	it('should handle FETCH_USER_REJECTED (with response message)', ()=> {
	  	const action = {
	  		type: "FETCH_USER_REJECTED",
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