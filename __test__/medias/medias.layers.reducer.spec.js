import { mediasLayerInitialState, gridLayerInitalState, selectedMediasLayerInitialState,
  mediasLayerReducer, gridLayeReducer, selectedMediasLayerReducer, defaultLayerReducer } 
  from "../../src/frontend/modules/medias/reducers/medias.layers.reducer"

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
})