import { mediasSourceInitialState, gridMediasSourceInitialState, selectedMediasSourceInitialState,
  mediasSourceReducer, gridMediasSourceReducer, selectedMediasSourceReducer, defaultSourceReducer } 
  from "../../src/frontend/modules/medias/reducers/medias.sources.reducer"
import { actions } from "../../src/frontend/modules"

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
        didChange: undefined
      }
    })
  })
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
    it('should ask for source reload (by setting metadata\'s didChange)', () => {
      const action = {
        type: "MEDIAS_UPLOAD_FULFILLED"
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
    it('should ask for source reload (by setting metadata\'s didChange)', () => {
      const action = {
        type: "MEDIAS_DELETE_FULFILLED"
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
    it('should ask for source reload (by setting metadata\'s didChange)', () => {
      const action = {
        type: "MEDIAS_UPLOAD_FULFILLED"
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
    it('should ask for source reload (by setting metadata\'s didChange)', () => {
      const action = {
        type: "MEDIAS_DELETE_FULFILLED"
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