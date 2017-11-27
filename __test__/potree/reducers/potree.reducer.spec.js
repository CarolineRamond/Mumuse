import reducer
    from "../../../src/frontend/modules/potree/reducers/potree.reducer"
import { actions } from "../../../src/frontend/modules"

describe('potree reducer', () => {
    it('should add clickedPointClouds to metaData when no media was previously selected', () => {
        const features = [{
            type: "Feature",
            geometry: { type: "Polygon" },
            properties: { _id: "5a0e9dab75b85544253e4fb2" }
        }];

        const action = actions.clickPointCloud({ features });

        expect(reducer({}, action)).toEqual({
            "metaData": {                      
                "_id": "5a0e9dab75b85544253e4fb2"      
            }                                        
        });
    });

    it('should replace clickedPointCloud in data when a media was previously selected (no multiselection)', () => {
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

        const action1 = actions.clickPointCloud({ features: features1 });
        const action2 = actions.clickPointCloud({ features: features2 });

        const initialState = reducer({}, action1);

        expect(reducer(initialState, action2)).toEqual({
            metaData: {
                "_id": "5a0e9dab75b85544253e4fb3" 
            }
        });
    });
});