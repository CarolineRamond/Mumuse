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

});