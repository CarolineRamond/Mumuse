import reducer
    from "../../../src/frontend/modules/potree/potree.reducer"
import { actions } from "../../../src/frontend/modules"

describe('potree reducer', () => {
    it('should transmit a pointCloud to pointcloud reducer when a point cloud is clicked', () => {
        const features = [{
            type: "Feature",
            layer: { id: "pointClouds-layer" },
            geometry: { type: "Polygon" },
            properties: { _id: "5a0e9dab75b85544253e4fb2" }
        }];

        const action = actions.clickPointCloud({ features });

        expect(reducer({}, action).pointCloud).toEqual({
            "metaData": {                      
                "_id": "5a0e9dab75b85544253e4fb2"      
            }                                        
        });
    });

    it('should transmit a pointCloud to pointcloud reducer when a media belonging to a visible point cloud is clicked', () => {
        const visiblePointCloudFeatures = [{
            type: "Feature",
            layer: { id: "pointClouds-layer" },
            geometry: { type: "Polygon" },
            properties: { _id: "5a0e9dab75b85544253e4fb2", attr: "value" }
        }];

        const action1 = actions.updateFeaturesPointCloud({ features: visiblePointCloudFeatures });
        const initialState = reducer({}, action1);

        const mediaFeatures = [{
            type: "Feature",
            layer: { id: "medias-layer" },
            properties: { _id: "5a0e9dab75b85544253e4fb3", potreedataSet: "5a0e9dab75b85544253e4fb2" }
        }];

        const action2 = actions.clickPointCloud({ features: mediaFeatures });

        expect(reducer(initialState, action2).pointCloud).toEqual({
            "metaData": {                      
                "_id": "5a0e9dab75b85544253e4fb2",
                attr: "value"    
            }                                        
        });
    });
});