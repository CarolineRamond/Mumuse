import { mediasLayerInitialState, gridLayerInitialState, selectedMediasLayerInitialState,
  mediasLayerReducer, gridLayerReducer, selectedMediasLayerReducer, defaultLayerReducer } 
  from "../../../src/frontend/modules/medias/reducers/medias.layers.reducer"
import { actions } from "../../../src/frontend/modules"

describe('default reducer', () => {
  const reducer = defaultLayerReducer;

  it('should remove field metadata.didChange from layer', () => {
    const state = {
      id: "layerId",
      metadata: {
        isShown: true,
        didChange: { filter: true, layout: { visibility: "none" } }
      }
    };
    expect(reducer(state, {})).toEqual({
      id: "layerId",
      metadata: {
        isShown: true,
        didChange: undefined
      }
    })
  })
});

describe('medias layer reducer', () => {
  const reducer = mediasLayerReducer;

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(mediasLayerInitialState);
  });

  describe('on MEDIAS_INIT_SELECTED_FULFILLED', ()=> {
    it('should add selectedMediaId filter to the list of filters', () => {
      const action = {
        type: "MEDIAS_INIT_SELECTED_FULFILLED",
        payload: {
          data: {
            type: "Feature",
            geometry: { type: "Point" },
            properties: { _id: "5a0e9dab75b85544253e4fb2" }
          }
        }
      }

      // layer's filter should change : selected medias should be filtered out by id
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb2"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });
  });

  describe('on MEDIAS_CLICK', ()=> {
    it('should add clickedMediaIds filter when no media was previously selected', () => {
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

      // layer's filter should change : selected medias should be filtered out by id
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb2", "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should replace clickedMediaId filter when a media was previously selected (no multiselection)', () => {
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

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : only last selected media should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
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

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : only last selected media should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should allow multiselection for admin user => id filters are kept and not replaced', () => {
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

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : all medias should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb2"], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });
  });

  describe('on MEDIAS_SELECT_BY_ID', ()=> {
    it('should add mediaId filter when no media was previously selected', () => {
      const action = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });

      // layer's filter should change : selected medias should be filtered out by id
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb2"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should replace mediaId filter when a media was previously selected (no multiselection)', () => {
      const action1 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });
      const action2 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb3" });

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : only last selected media should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should not allow multiselection for non admin user', () => {
      const action1 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });
      const action2 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb3", ctrlKey: true });

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : only last selected media should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should allow multiselection for admin user => id filters are kept and not replaced', () => {
      const action1 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });
      const action2 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb3", ctrlKey: true, isAdmin: true });

      const initialState = reducer(mediasLayerInitialState, action1);

      // layer's filter should change : all medias should be filtered out by id
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ['!in', '_id', "5a0e9dab75b85544253e4fb2"], ['!in', '_id', "5a0e9dab75b85544253e4fb3"] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });
  });

  describe('on MEDIAS_TIMELINE_UPDATE', ()=> {
    it('should add date filter when no date was previously chosen', () => {
      const now = Date.now();
      const action = actions.updateTimelineMedias({ value: now });

      // layer's filter should change : a date filter should be added
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ["<=", "date", now] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should replace date filter when a date was previously chosen', () => {
      const date1 = Date.now();
      const date2 = Date.now();
      const action1 = actions.updateTimelineMedias({ value: date1 });
      const action2 = actions.updateTimelineMedias({ value: date2 });
      const initialState = reducer(mediasLayerInitialState, action1)

      // layer's filter should change : a date filter should be added
      expect(reducer(initialState, action2)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ["<=", "date", date2] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should not erase id filters', () => {
      const date1 = Date.now();
      const date2 = Date.now();
      const action1 = actions.updateTimelineMedias({ value: date1 });
      const action2 = actions.selectMediaById({ mediaId: "5a0e9dab75b85544253e4fb2" });
      const action3 = actions.updateTimelineMedias({ value: date2 });
      const initialState = reducer(
        reducer(mediasLayerInitialState, action1),
        action2
      );

      // layer's filter should change : a date filter should be added
      expect(reducer(initialState, action3)).toEqual({
        ...mediasLayerInitialState,
        filter: [ 'all', ['has', 'loc'], ["!in", "_id", "5a0e9dab75b85544253e4fb2"], ["<=", "date", date2] ],
        metadata: {
          ...mediasLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });
  });

  describe('on MEDIAS_GRID_UPDATE_FEATURE', ()=> {

    it('should keep layer locked if mediaCount > 2000 & zoom <= 14', () => {
      const features = [{
        type: "Feature",
        properties: { allMediaCount: 2003 }
      }];
      const zoom = 7;
      const action = actions.updateFeaturesGridMedias({ features, zoom });

      // there are too much medias on screen => nothing should change
      expect(reducer(mediasLayerInitialState, action)).toEqual(mediasLayerInitialState);
    });

    it('should unlock layer if zoom > 14 (even if mediaCount > 2000)', () => {
      const features = [{
        type: "Feature",
        properties: { allMediaCount: 2003 }
      }];
      const zoom = 15;
      const action = actions.updateFeaturesGridMedias({ features, zoom });

      // min zoom was reached : medias should be unlocked and shown
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: ['all'],
        minzoom: 14,
        paint: { 
          ...mediasLayerInitialState.paint,
          "circle-opacity": 1 
        },
        metadata: {
          ...mediasLayerInitialState.metadata,
          isShown: true,
          isLocked: false,
          didChange: { filter: true, zoom: true, paint: { "circle-opacity": 1 } }
        }
      });
    });

    it('should unlock layer if mediaCount < 2000', () => {
      const features = [{
        type: "Feature",
        properties: { allMediaCount: 1999 }
      }];
      const zoom = 7;
      const action = actions.updateFeaturesGridMedias({ features, zoom });

      // medias should be unlocked and shown
      expect(reducer(mediasLayerInitialState, action)).toEqual({
        ...mediasLayerInitialState,
        filter: ['all'],
        minzoom: 7,
        paint: { 
          ...mediasLayerInitialState.paint,
          "circle-opacity": 1 
        },
        metadata: {
          ...mediasLayerInitialState.metadata,
          isShown: true,
          isLocked: false,
          didChange: { filter: true, zoom: true, paint: { "circle-opacity": 1 } }
        }
      });
    });
  });

  describe('on TOGGLE_LAYER', ()=> {
    it('should do nothing when action\'s layerId is different from "medias-layer"', () => {
      const action = actions.toggleLayer({ layerId: "anything" });
      expect(reducer(mediasLayerInitialState, action)).toEqual(mediasLayerInitialState);
    });

    it('should toggle layer when action\'s layerId is "medias-layer"', () => {
      const features = [{
        type: "Feature",
        properties: { allMediaCount: 1998 }
      }];
      const action1 = actions.updateFeaturesGridMedias({ features });
      const action2 = actions.toggleLayer({ layerId: "medias-layer" });
      const initialState = reducer(mediasLayerInitialState, action1);

      expect(reducer(initialState, action2)).toEqual({
        ...initialState,
        layout: {
          ...initialState.layout,
          visibility: "none"
        },
        metadata: {
          ...initialState.metadata,
          isShown: false,
          wasShownBeforeLock: false,
          didChange: { layout: { visibility: "none" } }
        }
      });
    });

    it('should handle 2 consecutive toggles', () => {
      const features = [{
        type: "Feature",
        properties: { allMediaCount: 1998 }
      }];
      const action1 = actions.updateFeaturesGridMedias({ features });
      const action2 = actions.toggleLayer({ layerId: "medias-layer" });
      const action3 = actions.toggleLayer({ layerId: "medias-layer" });
      const initialState = reducer(
          reducer(mediasLayerInitialState, action1),
          action2
      );

      expect(reducer(initialState, action3)).toEqual({
        ...initialState,
        layout: {
          ...initialState.layout,
          visibility: "visible"
        },
        metadata: {
          ...initialState.metadata,
          isShown: true,
          wasShownBeforeLock: true,
          didChange: { layout: { visibility: "visible" } }
        }
      });
    });
  });
});

describe('medias grid layer reducer', () => {
  const reducer = gridLayerReducer;

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(gridLayerInitialState);
  });

  describe('on TOGGLE_LAYER', ()=> {
    it('should do nothing when action\'s layerId is different from "grid-medias-layer"', () => {
      const action = actions.toggleLayer({ layerId: "anything" });
      expect(reducer(gridLayerInitialState, action)).toEqual(gridLayerInitialState);
    });

    it('should toggle layer when action\'s layerId is "grid-medias-layer"', () => {
      const action = actions.toggleLayer({ layerId: "grid-medias-layer" });

      expect(reducer(gridLayerInitialState, action)).toEqual({
        ...gridLayerInitialState,
        paint: {
          ...gridLayerInitialState.paint,
          "fill-opacity": {
            "property": "zeroMediaOpacity",
            "type": "exponential",
            "stops" : [
                [0, 0],
                [1, 0.2],
                [100, 0.8]
            ]
          }
        },
        metadata: {
          ...gridLayerInitialState.metadata,
          isShown: false,
          didChange: { 
            paint: { 
              "fill-opacity": {
                "property": "zeroMediaOpacity",
                "type": "exponential",
                "stops" : [
                    [0, 0],
                    [1, 0.2],
                    [100, 0.8]
                ]
              } 
            } 
          }
        }
      });
    });

    it('should handle two consecutive toggle', () => {
      const action1 = actions.toggleLayer({ layerId: "grid-medias-layer" });
      const action2 = actions.toggleLayer({ layerId: "grid-medias-layer" });
      const initialState = reducer(gridLayerInitialState, action1);

      expect(reducer(initialState, action2)).toEqual({
        ...gridLayerInitialState,
        paint: {
          ...gridLayerInitialState.paint,
          "fill-opacity": {
            "property": "allMediaOpacity",
            "type": "exponential",
            "stops" : [
                [0, 0],
                [1, 0.2],
                [100, 0.8]
            ]
          }
        },
        metadata: {
          ...gridLayerInitialState.metadata,
          isShown: true,
          didChange: { 
            paint: { 
              "fill-opacity": {
                "property": "allMediaOpacity",
                "type": "exponential",
                "stops" : [
                    [0, 0],
                    [1, 0.2],
                    [100, 0.8]
                ]
              } 
            } 
          }
        }
      });
    });

  });

  describe('on MEDIAS_TIMELINE_UPDATE', ()=> {
    it('should add a minDate filter when no date was previously chosen', ()=> {
      const date = Date.now();
      const action = actions.updateTimelineMedias({ value: date });

      expect(reducer(gridLayerInitialState, action)).toEqual({
        ...gridLayerInitialState,
        filter: ['all', ['<=', "minDate", date]],
        metadata: {
          ...gridLayerInitialState.metadata,
          didChange: { filter: true }
        }
      });
    });

    it('should replace previous minDate filter when a date was previously chosen', ()=> {
      const date1 = Date.now();
      const date2 = Date.now() + 1000;
      const action1 = actions.updateTimelineMedias({ value: date1 });
      const action2 = actions.updateTimelineMedias({ value: date2 });

      const initialState = reducer(gridLayerInitialState, action1);
      expect(reducer(initialState, action2)).toEqual({
        ...initialState,
        filter: ['all', ['<=', "minDate", date2]],
        metadata: {
          ...initialState.metadata,
          didChange: { filter: true }
        }
      });
    });
  });
});

describe('selected medias layer reducer', () => {
  const reducer = selectedMediasLayerReducer;

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(selectedMediasLayerInitialState);
  });

  describe('on TOGGLE_LAYER', ()=> {
    it('should do nothing when action\'s layerId is different from "selected-medias-layer"', () => {
      const action = actions.toggleLayer({ layerId: "anything" });
      expect(reducer(selectedMediasLayerInitialState, action)).toEqual(selectedMediasLayerInitialState);
    });

    it('should toggle layer when action\'s layerId is "selected-medias-layer"', () => {
      const action = actions.toggleLayer({ layerId: "selected-medias-layer" });
      expect(reducer(selectedMediasLayerInitialState, action)).toEqual({
        ...selectedMediasLayerInitialState,
        layout: {
          ...selectedMediasLayerInitialState.layout,
          visibility: "none"
        },
        metadata: {
          ...selectedMediasLayerInitialState.metadata,
          isShown: false,
          didChange: { layout: { visibility: "none" }}
        }
      });
    });

    it('should handle two consecutive toggles', () => {
      const action1 = actions.toggleLayer({ layerId: "selected-medias-layer" });
      const action2 = actions.toggleLayer({ layerId: "selected-medias-layer" });
      const initialState = reducer(selectedMediasLayerInitialState, action1);

      expect(reducer(initialState, action2)).toEqual({
        ...selectedMediasLayerInitialState,
        layout: {
          ...selectedMediasLayerInitialState.layout,
          visibility: "visible"
        },
        metadata: {
          ...selectedMediasLayerInitialState.metadata,
          isShown: true,
          didChange: { layout: { visibility: "visible" }}
        }
      });
    });
  });
});
