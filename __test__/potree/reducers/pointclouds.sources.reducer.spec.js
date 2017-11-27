import sourcesReducer, { pointCloudsSourceInitialState,
    sourcesInitialState, pointCloudsSourceReducer, defaultSourceReducer } 
    from "../../../src/frontend/modules/potree/reducers/pointClouds.sources.reducer"
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
});