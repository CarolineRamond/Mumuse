import { actions } from "../../src/frontend/modules"

describe('clickPointCloud action', () => {

    it('should handle a click on no features', () => {
        const params = { features: [] };
        expect(actions.clickPointCloud(params)).toEqual({
            type: 'POINTCLOUD_SELECT_BY_ID',
            payload: {
                pointCloudId: null
            }
        });
    });

    it('should handle a click on a single pointcloud', () => {
        const params = { 
        	features: [
        		{ 
        			layer: { id: 'pointClouds-layer' },
        			properties: { _id: 'id1' }
        		}
        	] 
        };
        expect(actions.clickPointCloud(params)).toEqual({
            type: 'POINTCLOUD_SELECT_BY_ID',
            payload: {
                pointCloudId: 'id1'
            }
        });
    });

    it('should handle a click on a single pointcloud +  medias', () => {
        const params = { 
        	features: [
        		{ 
        			layer: { id: 'pointClouds-layer' },
        			properties: { _id: 'id1' }
        		},
        		{ 
        			layer: { id: 'medias-layer' },
        			properties: { potreedataSet: 'id2' }
        		},
        		{ 
        			layer: { id: 'medias-layer' },
        			properties: { potreedataSet: 'id3' }
        		}
        	] 
        };
        expect(actions.clickPointCloud(params)).toEqual({
            type: 'POINTCLOUD_SELECT_BY_ID',
            payload: {
                pointCloudId: 'id1'
            }
        });
    });

    it('should handle a click on no pointcloud +  media linked to a pointcloud', () => {
        const params = { 
        	features: [
        		{ 
        			layer: { id: 'medias-layer' },
        			properties: { potreedataSet: 'id2' }
        		}
        	] 
        };
        expect(actions.clickPointCloud(params)).toEqual({
            type: 'POINTCLOUD_SELECT_BY_ID',
            payload: {
                pointCloudId: 'id2'
            }
        });
    });

    it('should handle a click on no pointcloud +  medias not linked to a pointcloud', () => {
        const params = { 
        	features: [
        		{ 
        			layer: { id: 'medias-layer' },
        			properties: { name: 'media1' }
        		},
        		{ 
        			layer: { id: 'medias-layer' },
        			properties: { name: 'media2' }
        		}
        	] 
        };
        expect(actions.clickPointCloud(params)).toEqual({
            type: 'POINTCLOUD_SELECT_BY_ID',
            payload: {
                pointCloudId: null
            }
        });
    });

});