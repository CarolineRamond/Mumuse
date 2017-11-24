import reducer, { initialState }
	from "../../../src/frontend/modules/users/reducers/users.usersList.reducer"
import { actions } from "../../../src/frontend/modules"

describe('admin users list reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

	it('should handle FETCH_USERS_LIST_PENDING', ()=> {
	  	const action = {
	  		type: "FETCH_USERS_LIST_PENDING",
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: true,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle FETCH_USERS_LIST_FULFILLED', ()=> {
	  	const action = {
	  		type: "FETCH_USERS_LIST_FULFILLED",
	  		payload: {
	  			data: [{ email: "test@test.com", _id: 1 }],
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: [{ email: "test@test.com", _id: 1 }],
	  		error: null
	  	});
  	});

  	it('should handle FETCH_USERS_LIST_REJECTED (without response message)', ()=> {
	  	const action = {
	  		type: "FETCH_USERS_LIST_REJECTED",
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

  	it('should handle FETCH_USERS_LIST_REJECTED (with response message)', ()=> {
	  	const action = {
	  		type: "FETCH_USERS_LIST_REJECTED",
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

  	describe('on CREATE_USER_FULFILLED', ()=> {
	  	it('should add newly created user to current list', ()=> {
	  		const action1 = {
		  		type: "FETCH_USERS_LIST_FULFILLED",
		  		payload: {
		  			data: [{ email: "test1@test.com", _id: 1 }],
			  	}
		  	};
		  	const state = reducer(initialState, action1);
		  	const action2 = {
		  		type: "CREATE_USER_FULFILLED",
		  		payload: {
	  				data: { email: "test2@test.com", _id: 2 }
			  	}
		  	};
		  	expect(reducer(state, action2)).toEqual({
		  		pending: false,
		  		data: [
		  			{ email: "test1@test.com", _id: 1 },
		  			{ email: "test2@test.com", _id: 2 }
		  		],
		  		error: null
		  	});
	  	});
	});

	describe('on UPDATE_USER_FULFILLED', ()=> {
	  	it('should update user in current list', ()=> {
	  		const action1 = {
		  		type: "FETCH_USERS_LIST_FULFILLED",
		  		payload: {
		  			data: [
		  				{ email: "test1@test.com", _id: 1 },
		  				{ email: "test2@test.com", _id: 2 }
		  			],
			  	}
		  	};
		  	const state = reducer(initialState, action1);
		  	const action2 = {
		  		type: "UPDATE_USER_FULFILLED",
		  		payload: {
	  				data: { email: "test1_updated@test.com", _id: 1 }
			  	}
		  	};
		  	expect(reducer(state, action2)).toEqual({
		  		pending: false,
		  		data: [
		  			{ email: "test1_updated@test.com", _id: 1 },
	  				{ email: "test2@test.com", _id: 2 }
		  		],
		  		error: null
		  	});
	  	});
	});

	describe('on DELETE_USERS_FULFILLED', ()=> {
	  	it('should delete user in current list', ()=> {
	  		const action1 = {
		  		type: "FETCH_USERS_LIST_FULFILLED",
		  		payload: {
		  			data: [
		  				{ email: "test1@test.com", _id: 1 },
		  				{ email: "test2@test.com", _id: 2 }
		  			]
			  	}
		  	};
		  	const state = reducer(initialState, action1);
		  	const action2 = {
		  		type: "DELETE_USERS_FULFILLED",
		  		payload: { data: [1] }
		  	};
		  	expect(reducer(state, action2)).toEqual({
		  		pending: false,
		  		data: [{ email: "test2@test.com", _id: 2 }],
		  		error: null
		  	});
	  	});
	});
});