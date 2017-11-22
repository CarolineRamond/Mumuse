import sourcesReducer, { mediasSourceInitialState, gridMediasSourceInitialState, 
    selectedMediasSourceInitialState, sourcesInitialState, mediasSourceReducer, 
    gridMediasSourceReducer, selectedMediasSourceReducer, defaultSourceReducer } 
    from "../../../src/frontend/modules/medias/reducers/medias.sources.reducer"
import { actions } from "../../../src/frontend/modules"

describe('default reducer', () => {
    const reducer = defaultSourceReducer;

    it('should remove field metadata.didChange from layer', () => {
        const state = {
            type: "vector",
            metadata: {
                loaded: true,
                didChange: true
            }
        };
        expect(reducer(state, {})).toEqual({
            type: "vector",
            metadata: {
                loaded: true,
                didChange: false
            }
        });
    });
});

describe('medias source reducer', () => {
    const reducer = mediasSourceReducer;

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(mediasSourceInitialState);
    });

    describe('on MEDIAS_UPDATE_FEATURES', ()=> {
        it('should add features to metadata', () => {
            const features = [{
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }, {
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }]
            const action = actions.updateFeaturesMedias({ features });

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    loaded: true,
                    didChange: false,
                    renderedFeatures: features
                }
            });
        });
    });

    describe('on LOGOUT_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "LOGOUT_FULFILLED"
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on FETCH_USER_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "FETCH_USER_FULFILLED"
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on LOGIN_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "LOGIN_FULFILLED"
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_UPLOAD_FULFILLED', ()=> {
        it('shouldnt do anything if no medias were uploaded', () => {
            const action = {
                type: "MEDIAS_UPLOAD_FULFILLED",
                payload: {
                    data: []
                }
            };
            expect(reducer(mediasSourceInitialState, action)).toEqual(mediasSourceInitialState);
        });

        it('should ask for source reload (by setting metadata\'s didChange) if medias were uploaded', () => {
            const action = {
                type: "MEDIAS_UPLOAD_FULFILLED",
                 payload: {
                    data: [{
                        type: "Feature",
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                }
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_DELETE_FULFILLED', ()=> {
        it('shouldnt do anything if no medias were deleted', () => {
            const action = {
                type: "MEDIAS_DELETE_FULFILLED",
                payload: {
                    data: []
                }
            };
            expect(reducer(mediasSourceInitialState, action)).toEqual(mediasSourceInitialState);
        });

        it('should ask for source reload (by setting metadata\'s didChange) if medias were deleted', () => {
            const action = {
                type: "MEDIAS_DELETE_FULFILLED",
                 payload: {
                    data: [{
                        type: "Feature",
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                }
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_MAP_END_DRAG_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "MEDIAS_MAP_END_DRAG_FULFILLED"
            };

            expect(reducer(mediasSourceInitialState, action)).toEqual({
                ...mediasSourceInitialState,
                metadata: {
                    ...mediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });
});

describe('medias grid source reducer', () => {
    const reducer = gridMediasSourceReducer;

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(gridMediasSourceInitialState);
    });

    describe('on MEDIAS_GRID_UPDATE_FEATURES', ()=> {
        it('should add features to metadata', () => {
            const features = [{
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }, {
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }]
            const action = actions.updateFeaturesGridMedias({ features });

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    loaded: true,
                    didChange: false,
                    renderedFeatures: features
                }
            });
        });
    });

    describe('on LOGOUT_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "LOGOUT_FULFILLED"
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on FETCH_USER_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "FETCH_USER_FULFILLED"
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on LOGIN_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "LOGIN_FULFILLED"
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_UPLOAD_FULFILLED', ()=> {
        it('shouldnt do anything if no medias were uploaded', () => {
            const action = {
                type: "MEDIAS_UPLOAD_FULFILLED",
                payload: {
                    data: []
                }
            };
            expect(reducer(gridMediasSourceInitialState, action)).toEqual(gridMediasSourceInitialState);
        });

        it('should ask for source reload (by setting metadata\'s didChange) if medias were uploaded', () => {
            const action = {
                type: "MEDIAS_UPLOAD_FULFILLED",
                 payload: {
                    data: [{
                        type: "Feature",
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                }
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_DELETE_FULFILLED', ()=> {
        it('shouldnt do anything if no medias were deleted', () => {
            const action = {
                type: "MEDIAS_DELETE_FULFILLED",
                payload: {
                    data: []
                }
            };
            expect(reducer(gridMediasSourceInitialState, action)).toEqual(gridMediasSourceInitialState);
        });

        it('should ask for source reload (by setting metadata\'s didChange) if medias were deleted', () => {
            const action = {
                type: "MEDIAS_DELETE_FULFILLED",
                 payload: {
                    data: [{
                        type: "Feature",
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                }
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_MAP_END_DRAG_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "MEDIAS_MAP_END_DRAG_FULFILLED"
            };

            expect(reducer(gridMediasSourceInitialState, action)).toEqual({
                ...gridMediasSourceInitialState,
                metadata: {
                    ...gridMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });
});

describe('selected medias source reducer', () => {
    const reducer = selectedMediasSourceReducer;

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(selectedMediasSourceInitialState);
    });

    describe('on MEDIAS_INIT_SELECTED_FULFILLED', ()=> {
        it('should add feature to source\'s data', () => {
            const feature = {
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }
            const action = {
                type: "MEDIAS_INIT_SELECTED_FULFILLED",
                payload: { data: feature }
            };

            expect(reducer(selectedMediasSourceInitialState, action)).toEqual({
                ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: [feature]
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                }
            });
        });
    });

    describe('on MEDIAS_CLICK', ()=> {
        it('should add clickedMedias to data when no media was previously selected', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }, {
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];

            const action = actions.clickMedias({ features });

            expect(reducer(selectedMediasSourceInitialState, action)).toEqual({
                ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: features
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                    selectFilterPending: true, 
                    stillFiltered: []
                }
            });
        });

        it('should replace clickedMedia in data when a media was previously selected (no multiselection)', () => {
            const features1 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const features2 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];

            const action1 = actions.clickMedias({ features: features1 });
            const action2 = actions.clickMedias({ features: features2 });

            const initialState = reducer(selectedMediasSourceInitialState, action1);

            expect(reducer(initialState, action2)).toEqual({
                ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: features2
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                    selectFilterPending: true, 
                    stillFiltered: []
                }
            });
        });

        it('should not allow multiselection for non admin user', () => {
            const features1 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const features2 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];

            const action1 = actions.clickMedias({ features: features1 });
            const action2 = actions.clickMedias({ features: features2, ctrlKey: true });

            const initialState = reducer(selectedMediasSourceInitialState, action1);
            expect(reducer(initialState, action2)).toEqual({
            ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: features2
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                    selectFilterPending: true, 
                    stillFiltered: []
                }
            });
        });

        it('should allow multiselection for admin user => features are kept and not replaced', () => {
            const features1 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const features2 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];

            const action1 = actions.clickMedias({ features: features1 });
            const action2 = actions.clickMedias({ features: features2, ctrlKey: true, isAdmin: true });
            const initialState = reducer(selectedMediasSourceInitialState, action1);

            expect(reducer(initialState, action2)).toEqual({
                ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: features1.concat(features2)
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                    selectFilterPending: true, 
                    stillFiltered: []
                }
            });
        });

        it('should keep previously selected medias in metadata.stillFiltered when a selectfilter is not being applied', ()=> {
            const features1 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const features2 = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];

            const action1 = actions.clickMedias({ features: features1 });
            const action2 = actions.clickMedias({ features: features2, ctrlKey: true, isAdmin: true });
            const initialState = reducer(selectedMediasSourceInitialState, action1);
            initialState.metadata.selectFilterPending = false;

            expect(reducer(initialState, action2)).toEqual({
            ...selectedMediasSourceInitialState,
                data: {
                    ...selectedMediasSourceInitialState.data,
                    features: features1.concat(features2)
                },
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true,
                    selectFilterPending: true, 
                    stillFiltered: features1
                }
            });
        });
        });

    describe('on MEDIAS_UPDATE_FEATURES', ()=> {
        it('should reset filter pending data (metadata.selectFilterPending & metadata.stillFiltered)', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]

            const action1 = actions.clickMedias({ features });
            const action2 = actions.updateFeaturesMedias({ features });
            const initialState = reducer(selectedMediasSourceInitialState, action1);

            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                metadata: {
                    ...initialState.metadata,
                    didChange: false,
                    selectFilterPending: false, 
                    stillFiltered: []
                }
            });
        })
    });

    describe('on MEDIAS_MAP_START_DRAG', ()=> {
        it('should do nothing if user is not admin', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const action = actions.startDragMapMedias({ event: { features }, isAdmin: false });
            expect(reducer(selectedMediasSourceInitialState, action)).toEqual(selectedMediasSourceInitialState);
        })

        it('should set metadata\'s draggingFeatureId if user is admin', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point" },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const action = actions.startDragMapMedias({ event: { features }, isAdmin: true });
            expect(reducer(selectedMediasSourceInitialState, action)).toEqual({
                ...selectedMediasSourceInitialState,
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    draggingFeatureId: "5a0e9dab75b85544253e4fb2"
                }
            });
        })
    });

    describe('on MEDIAS_MAP_DRAG', ()=> {
        it('should do nothing if there is no draggingFeatureId', () => {
            // this case is not reached a priori 
            // (action is not dispatched unless an admin is dragging a media)
            const action = actions.dragMapMedias({ event: { lng: 0, lat: 2 }, isAdmin: true });
            expect(reducer(selectedMediasSourceInitialState, action))
                .toEqual(selectedMediasSourceInitialState);
        });

        it('should do nothing if user is not admin', () => {
            // this case is not reached a priori 
            // (action is not dispatched unless an admin is dragging a media)
            const action = actions.dragMapMedias({ event: { lng: 0, lat: 2 }, isAdmin: false });
            expect(reducer(selectedMediasSourceInitialState, action))
                .toEqual(selectedMediasSourceInitialState);
        });

        it('should update dragging feature position in source\'s data', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point", coordinates: [1,1] },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]
            const action1 = actions.clickMedias({ features });
            const action2 = actions.startDragMapMedias({ event: { features }, isAdmin: true });
            const initialState = reducer(
            reducer(selectedMediasSourceInitialState, action1),
            action2
            );

            const action3 = actions.dragMapMedias({ event: { lngLat: { lng: 0, lat: 2 } }, isAdmin: true });

            expect(reducer(initialState, action3)).toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    features: [{
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [0,2] },
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                },
                metadata: {
                    ...initialState.metadata,
                    draggingFeatureId: "5a0e9dab75b85544253e4fb2",
                    didChange: true
                }
            });
        });
    });

    describe('on MEDIAS_MAP_END_DRAG_PENDING', ()=> {
        it('should reset metadata\'s draggingFeatureId', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point", coordinates: [0,2] },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }] 
            const action1 = actions.startDragMapMedias({
                event: { features },
                isAdmin: true
            });
            const initialState = reducer(selectedMediasSourceInitialState, action1);

            const action2 = {
                type: "MEDIAS_MAP_END_DRAG_PENDING"
            };
            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                metadata: {
                    ...initialState.metadata,
                    draggingFeatureId: null,
                    didChange: false
                }
            });
        });
    });

    describe('on MEDIAS_MAP_END_DRAG_FULFILLED', ()=> {
        it('should ask for source reload (by setting metadata\'s didChange)', () => {
            const action = {
                type: "MEDIAS_MAP_END_DRAG_FULFILLED"
            };
            expect(reducer(selectedMediasSourceInitialState, action)).toEqual({
                ...selectedMediasSourceInitialState,
                metadata: {
                    ...selectedMediasSourceInitialState.metadata,
                    didChange: true
                }
            });
        });
    });

     describe('on MEDIAS_DELETE_FULFILLED', ()=> {
        it('shouldnt do anything if no medias were deleted', ()=> {
            const action = {
                type: "MEDIAS_DELETE_FULFILLED",
                payload: {
                    data: []
                }
            };
            expect(reducer(selectedMediasSourceInitialState, action))
                .toEqual(selectedMediasSourceInitialState);
        });

        it('should remove source\'s features that match deleted medias', () => {
            const features = [{
                type: "Feature",
                geometry: { type: "Point", coordinates: [0,2] },
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }, {
                type: "Feature",
                geometry: { type: "Point", coordinates: [0,2] },
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }] 
            const action1 = actions.clickMedias({ features });
            const initialState = reducer(selectedMediasSourceInitialState, action1);

            const action2 = {
                type: "MEDIAS_DELETE_FULFILLED",
                payload: {
                    data: [{
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [0,2] },
                        properties: { _id: "5a0e9dab75b85544253e4fb2" }
                    }]
                }
            };
            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                data: {
                    ...initialState.data,
                    features: [{
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [0,2] },
                        properties: { _id: "5a0e9dab75b85544253e4fb3" }
                    }]
                },
                metadata: {
                    ...initialState.metadata,
                    didChange: true
                }
            });
        });
    });
});

describe('sources reducer', () => {
    const reducer = sourcesReducer
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(sourcesInitialState);
    });

    describe('on MEDIAS_SELECT_BY_ID', ()=> {
        it('should extract feature from medias-source before dispatching action to subreducers', ()=> {
            const features = [{
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }, {
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb3" }
            }];
            const action1 = actions.updateFeaturesMedias({ features })
            const initialState = reducer(sourcesInitialState, action1);
            
            const action2 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });
            expect(reducer(initialState, action2)["selected-medias-source"].data.features).toEqual([{
                type: "Feature",
                properties: { _id: "5a0e9dab75b85544253e4fb2" }
            }]);
        });
    });
});