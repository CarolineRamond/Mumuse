import reducer
    from "../../../src/frontend/modules/potree/reducers/pointcloud.reducer"
import { actions } from "../../../src/frontend/modules"

describe('pointcloud reducer', () => {
    it('should add clickedPointClouds to metaData when no media was previously selected', () => {
        const pointCloud = {
            type: "Feature",
            geometry: { type: "Polygon" },
            properties: { _id: "5a0e9dab75b85544253e4fb2" }
        };

        const action = {
            type: "POINTCLOUD_CLICK",
            payload: { pointCloud }
        };

        expect(reducer({}, action)).toEqual({
            "metaData": {                      
                "_id": "5a0e9dab75b85544253e4fb2"      
            }                                        
        });
    });

    it('should replace clickedPointCloud in data when a media was previously selected (no multiselection)', () => {
        const pointCloud1 = {
            type: "Feature",
            geometry: { type: "Point" },
            properties: { _id: "5a0e9dab75b85544253e4fb2" }
        }
        const pointCloud2 = {
            type: "Feature",
            geometry: { type: "Point" },
            properties: { _id: "5a0e9dab75b85544253e4fb3" }
        };

        const action1 = {
            type: 'POINTCLOUD_CLICK',
            payload: { pointCloud: pointCloud1 }
        };

        const action2 = {
            type: 'POINTCLOUD_CLICK',
            payload: { pointCloud: pointCloud2 }
        };

        const initialState = reducer({}, action1);

        expect(reducer(initialState, action2)).toEqual({
            metaData: {
                "_id": "5a0e9dab75b85544253e4fb3" 
            }
        });
    });
});