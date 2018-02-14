import sourcesReducer, { pointCloudsSourceInitialState,
    sourcesInitialState, pointCloudsSourceReducer, defaultSourceReducer } 
    from "../../../src/frontend/modules/potree/reducers/pointclouds.sources.reducer"
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

describe('pointClouds source reducer', () => {
    const reducer = pointCloudsSourceReducer;

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(pointCloudsSourceInitialState);
    });

    describe('on POINTCLOUD_FETCH_FULFILLED', ()=> {
        it('should add received features into source\'s features, enhanced with default properties (_isShown, _isSelected, _isInBounds)', () => {
            const action = {
                type: 'POINTCLOUD_FETCH_FULFILLED',
                payload: {
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                properties: { _id: 'id1', name: 'feature1' }
                            },
                            {
                                properties: { _id: 'id2', name: 'feature2' }
                            },
                            {
                                properties: { _id: 'id3', name: 'feature3' }
                            }
                        ]
                    }
                }
            };
            expect(reducer(pointCloudsSourceInitialState, action)).toEqual({
                ...pointCloudsSourceInitialState,
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            properties: { _id: 'id1', name: 'feature1', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id2', name: 'feature2', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id3', name: 'feature3', _isShown: true, _isSelected: false, _isInBounds: true }
                        }
                    ]
                },
                metadata: {
                    ...pointCloudsSourceInitialState.metadata,
                    didChange: true,
                    initSelectedPending: undefined
                }
            });
        });
    });

    describe('on POINTCLOUD_INIT_SELECTED', ()=> {
        it('should store initial pointCloudId into source.metadata.initSelectedPending when no features were retrieved yet', () => {
            const action = actions.initSelectedPointCloud({ pointCloudId: 'id1' });
            expect(reducer(pointCloudsSourceInitialState, action)).toEqual({
                ...pointCloudsSourceInitialState,
                metadata: {
                    ...pointCloudsSourceInitialState.metadata,
                    initSelectedPending: 'id1'
                }
            });
        });

        it('should select initial pointCloud when source features were already retrieved', () => {

            const action1 = {
                type: 'POINTCLOUD_FETCH_FULFILLED',
                payload: {
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                properties: { _id: 'id1', name: 'feature1' }
                            },
                            {
                                properties: { _id: 'id2', name: 'feature2' }
                            },
                            {
                                properties: { _id: 'id3', name: 'feature3' }
                            }
                        ]
                    }
                }
            };
            const initialState = reducer(pointCloudsSourceInitialState, action1);

            const action2 = actions.initSelectedPointCloud({ pointCloudId: 'id2' });
            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            properties: { _id: 'id1', name: 'feature1', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id2', name: 'feature2', _isShown: true, _isSelected: true, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id3', name: 'feature3', _isShown: true, _isSelected: false, _isInBounds: true }
                        }
                    ]
                },
                metadata: {
                    ...initialState.metadata,
                    didChange: true,
                    initSelectedPending: undefined
                }
            });
        });
    });

    describe('on POINTCLOUD_SELECT_BY_ID', ()=> {
        it('should select associated pointcloud', () => {
            const action1 = {
                type: 'POINTCLOUD_FETCH_FULFILLED',
                payload: {
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                properties: { _id: 'id1', name: 'feature1' }
                            },
                            {
                                properties: { _id: 'id2', name: 'feature2' }
                            },
                            {
                                properties: { _id: 'id3', name: 'feature3' }
                            }
                        ]
                    }
                }
            };
            const initialState = reducer(pointCloudsSourceInitialState, action1);

            const action2 = actions.selectPointCloudById({ pointCloudId: 'id2' });
            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            properties: { _id: 'id1', name: 'feature1', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id2', name: 'feature2', _isShown: true, _isSelected: true, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id3', name: 'feature3', _isShown: true, _isSelected: false, _isInBounds: true }
                        }
                    ]
                },
                metadata: {
                    ...initialState.metadata,
                    didChange: true
                }
            });
        });
    });

    describe('on POINTCLOUD_TOGGLE', ()=> {
        it('should toggle associated pointcloud\'s visibility', () => {
            const action1 = {
                type: 'POINTCLOUD_FETCH_FULFILLED',
                payload: {
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                properties: { _id: 'id1', name: 'feature1' }
                            },
                            {
                                properties: { _id: 'id2', name: 'feature2' }
                            },
                            {
                                properties: { _id: 'id3', name: 'feature3' }
                            }
                        ]
                    }
                }
            };
            const initialState = reducer(pointCloudsSourceInitialState, action1);

            const action2 = actions.togglePointCloud({ pointCloudId: 'id2' });
            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            properties: { _id: 'id1', name: 'feature1', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id2', name: 'feature2', _isShown: false, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id3', name: 'feature3', _isShown: true, _isSelected: false, _isInBounds: true }
                        }
                    ]
                },
                metadata: {
                    ...initialState.metadata,
                    didChange: true
                }
            });
        });

        it('should handle two consecutive toggles', () => {
            const action1 = {
                type: 'POINTCLOUD_FETCH_FULFILLED',
                payload: {
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                properties: { _id: 'id1', name: 'feature1' }
                            },
                            {
                                properties: { _id: 'id2', name: 'feature2' }
                            },
                            {
                                properties: { _id: 'id3', name: 'feature3' }
                            }
                        ]
                    }
                }
            };
            const action2 = actions.togglePointCloud({ pointCloudId: 'id2' });
            const initialState = reducer(
                reducer(pointCloudsSourceInitialState, action1),
                action2
            );

            expect(reducer(initialState, action2)).toEqual({
                ...initialState,
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            properties: { _id: 'id1', name: 'feature1', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id2', name: 'feature2', _isShown: true, _isSelected: false, _isInBounds: true }
                        },
                        {
                            properties: { _id: 'id3', name: 'feature3', _isShown: true, _isSelected: false, _isInBounds: true }
                        }
                    ]
                },
                metadata: {
                    ...initialState.metadata,
                    didChange: true
                }
            });
        });
    });
});