import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import * as actions from "../../src/frontend/modules/medias/medias.actions";

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);

describe('medias async actions', ()=> {

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

	it('should handle multiple file upload', ()=> {
		const files = [
			new File([""], "test1.txt", {type : 'text/plain'}),
			new File([""], "test2.txt", {type : 'text/plain'}),
			new File([""], "test3.txt", {type : 'text/plain'}),
			new File([""], "test4.txt", {type : 'text/plain'})
		];
		const position = { lat: 0, lng: 0 };
		const forms = files.map((file)=> {
			var form = new FormData();
			form.append("latitude", 0);
			form.append("longitude", 0);
			form.append("size", file.size);
			form.append("file", file);
			return form;
		});

		mockAxios.onPost('/userdrive/media').replyOnce(200, {
			message: 'success uploading file'
		});
		mockAxios.onPost('/userdrive/media').replyOnce(400, {
			message: 'file already exists in db'
		});
		mockAxios.onPost('/userdrive/media').replyOnce(200, {
			message: 'success uploading file'
		});
		mockAxios.onPost('/userdrive/media').replyOnce(400, {
			message: 'file size exceeded'
		});

		const expectedActions = [
			{ type: "MEDIAS_UPLOAD_PENDING", payload: { index: 0 } },
			{ type: "MEDIAS_UPLOAD_PENDING", payload: { index: 1 } },
			{ type: "MEDIAS_UPLOAD_PENDING", payload: { index: 2 } },
			{ type: "MEDIAS_UPLOAD_PENDING", payload: { index: 3 } },
			{ 
				type: "MEDIAS_UPLOAD_FULFILLED", 
				payload: { 
					data: [files[0], files[2]], 
					error: {
						files: [files[1], files[3]], 
						messages: [
							"Error uploading file [test2.txt] : file already exists in db",
							"Error uploading file [test4.txt] : file size exceeded"
						]
					}
				}
			}
		];
		const store = mockStore({});
		return store.dispatch(actions.uploadMedias(files, position)).then(()=> {
			expect(store.getActions()).toEqual(expectedActions);
		}).catch((err)=> {
			expect(err).toBeUndefined();
		});
	});
});
