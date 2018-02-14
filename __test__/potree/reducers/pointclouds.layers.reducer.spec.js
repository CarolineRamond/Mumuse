import { pointCloudsLayerInitialState,
  pointCloudsLayerReducer, defaultLayerReducer } 
  from "../../../src/frontend/modules/potree/reducers/pointclouds.layers.reducer"
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

describe('pointclouds layer reducer', () => {
  const reducer = pointCloudsLayerReducer;

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(pointCloudsLayerInitialState);
  });

  describe('on TOGGLE_LAYER', ()=> {
    it('should do nothing when action\'s layerId is different from "pointClouds-layer"', () => {
      const action = actions.toggleLayer({ layerId: "anything" });
      expect(reducer(pointCloudsLayerInitialState, action)).toEqual(pointCloudsLayerInitialState);
    });

    it('should toggle layer when action\'s layerId is "pointClouds-layer"', () => {
      const features = [{
        type: "Feature",
        properties: {}
      }];
      const action = actions.toggleLayer({ layerId: "pointClouds-layer" });

      expect(reducer(pointCloudsLayerInitialState, action)).toEqual({
        ...pointCloudsLayerInitialState,
        layout: {
          ...pointCloudsLayerInitialState.layout,
          visibility: "none"
        },
        metadata: {
          ...pointCloudsLayerInitialState.metadata,
          isShown: false,
          didChange: { layout: { visibility: "none" } }
        }
      });
    });

    it('should handle 2 consecutive toggles', () => {
      const features = [{
        type: "Feature",
        properties: {}
      }];
      const action1 = actions.toggleLayer({ layerId: "pointClouds-layer" });
      const action2 = actions.toggleLayer({ layerId: "pointClouds-layer" });
      const initialState = reducer(pointCloudsLayerInitialState, action1);

      expect(reducer(initialState, action2)).toEqual({
        ...initialState,
        layout: {
          ...initialState.layout,
          visibility: "visible"
        },
        metadata: {
          ...initialState.metadata,
          isShown: true,
          didChange: { layout: { visibility: "visible" } }
        }
      });
    });
  });
});