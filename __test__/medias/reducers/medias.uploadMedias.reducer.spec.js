import reducer, { initialState }
	from "../../../src/frontend/modules/medias/reducers/medias.uploadMedias.reducer"
import { actions } from "../../../src/frontend/modules"

describe('medias uploader reducer', () => {

	it('should return the initial state', () => {
		expect(reducer(undefined, {})).toEqual(initialState);
	});

  	it('should handle MEDIAS_UPLOAD_PENDING', ()=> {
	  	const action = {
	  		type: "MEDIAS_UPLOAD_PENDING",
	  		payload: {
	  			index: 1
	  		}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: 1,
	  		data: null,
	  		error: null
	  	});
  	});

  	it('should handle MEDIAS_UPLOAD_FULFILLED', ()=> {
	  	const action = {
	  		type: "MEDIAS_UPLOAD_FULFILLED",
	  		payload: {
	  			data: [
		  			{ type: "Feature", properties: { _id: 1 } },
		  			{ type: "Feature", properties: { _id: 2 } }
		  		],
		  		error: {
		  			messages: ['Could not upload media 3'],
		  			medias: [{ type: "Feature", properties: { _id: 3 } }]
		  		}
		  	}
	  	};
	  	expect(reducer(initialState, action)).toEqual({
	  		pending: false,
	  		data: [
	  			{ type: "Feature", properties: { _id: 1 } },
	  			{ type: "Feature", properties: { _id: 2 } }
	  		],
	  		error: {
	  			messages: ['Could not upload media 3'],
	  			medias: [{ type: "Feature", properties: { _id: 3 } }]
	  		}
	  	});
  	});

  	it('should handle RESET_MEDIAS_UPLOAD', ()=> {
	  	const action = {
	  		type: "RESET_MEDIAS_UPLOAD"
	  	};
	  	expect(reducer(initialState, action)).toEqual(initialState);
  	});
});