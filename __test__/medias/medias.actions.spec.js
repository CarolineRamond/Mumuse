import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import * as actions from "../../src/frontend/modules/medias/medias.actions";

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);

describe('medias async actions', ()=> {
	afterEach(()=> {
		mockAxios.reset();
		mockAxios.restore();
	});

	// it('should handle a single successful file deletion', ()=> {
	// 	mockAxios.onDelete('/userdrive/media/1').reply(200, {
	// 		message: 'success deleting media'
	// 	});

	// 	const media = { type: "Feature", properties: { _id: 1, name: "media1.jpeg" } };
	// 	const expectedActions = [
	// 		{ type: "MEDIAS_DELETE_PENDING", payload: { index: 0 } },
	// 		{ type: "MEDIAS_DELETE_FULFILLED", payload: { data: [media], error: null } }
	// 	];
	// 	const store = mockStore({});
	// 	return store.dispatch(actions.deleteMedias([media])).then(()=> {
	// 		expect(store.getActions()).toEqual(expectedActions);
	// 	}).catch((err)=> {
	// 		expect(err).toBeUndefined();
	// 	});
	// });

	// it('should handle a single failed file deletion', ()=> {
	// 	mockAxios.onDelete('/userdrive/media/1').reply(400, {
	// 		message: 'Unknown id'
	// 	});

	// 	const media = { type: "Feature", properties: { _id: 1, name: "media1.jpeg" } };
	// 	const expectedActions = [
	// 		{ type: "MEDIAS_DELETE_PENDING", payload: { index: 0 } },
	// 		{ 
	// 			type: "MEDIAS_DELETE_FULFILLED", 
	// 			payload: { 
	// 				data: [], 
	// 				error: { medias: [media], messages: ["Error deleting media [media1.jpeg]"] }
	// 			}
	// 		}
	// 	];
	// 	const store = mockStore({});
	// 	return store.dispatch(actions.deleteMedias([media])).then(()=> {
	// 		expect(store.getActions()).toEqual(expectedActions);
	// 	}).catch((err)=> {
	// 		expect(err).toBeUndefined();
	// 	});
	// });

	it('should handle multiple file deletions', ()=> {
		mockAxios.onDelete('/userdrive/media/1').reply(200, {
			message: 'success deleting media'
		});
		mockAxios.onDelete('/userdrive/media/2').reply(400, {
			message: 'Unknown id'
		});
		mockAxios.onDelete('/userdrive/media/3').reply(200, {
			message: 'success deleting media'
		});
		mockAxios.onDelete('/userdrive/media/4').reply(400, {
			message: 'Unknown id'
		});

		const medias = [
			{ type: "Feature", properties: { _id: 1, name: "media1.jpeg" } },
			{ type: "Feature", properties: { _id: 2, name: "media2.jpeg" } },
			{ type: "Feature", properties: { _id: 3, name: "media3.jpeg" } },
			{ type: "Feature", properties: { _id: 4, name: "media4.jpeg" } }
		];
		const expectedActions = [
			{ type: "MEDIAS_DELETE_PENDING", payload: { index: 0 } },
			{ type: "MEDIAS_DELETE_PENDING", payload: { index: 1 } },
			{ type: "MEDIAS_DELETE_PENDING", payload: { index: 2 } },
			{ type: "MEDIAS_DELETE_PENDING", payload: { index: 3 } },
			{ 
				type: "MEDIAS_DELETE_FULFILLED", 
				payload: { 
					data: [medias[0], medias[2]], 
					error: { 
						medias: [medias[1], medias[3]], 
						messages: ["Error deleting media [media2.jpeg] : Unknown id", "Error deleting media [media4.jpeg] : Unknown id"] 
					}
				}
			}
		];
		const store = mockStore({});
		return store.dispatch(actions.deleteMedias(medias)).then(()=> {
			expect(store.getActions()).toEqual(expectedActions);
		}).catch((err)=> {
			expect(err).toBeUndefined();
		});
	});
});
