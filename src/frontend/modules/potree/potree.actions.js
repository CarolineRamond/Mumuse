import axios from 'axios';

export const fetchPointClouds = () => {
    return {
        type: 'POINTCLOUD_FETCH',
        payload: axios.get('/potreeviewer/potreedataset')
    };
};

export const clickPointCloud = ({ features }) => {
    const pointCloudFeatures = [];
    const mediaFeatures = [];
    let pointCloudId = null;
    features.map(feature => {
        if (feature.layer.id === 'pointClouds-layer') {
            pointCloudFeatures.push(feature);
        } else {
            mediaFeatures.push(feature);
        }
    });
    if (pointCloudFeatures.length > 0) {
        pointCloudId = pointCloudFeatures[0].properties._id;
    } else if (mediaFeatures.length > 0) {
        pointCloudId = mediaFeatures.reduce((value, feature) => {
            return feature.properties.potreedataSet || value;
        }, null);
    }
    return {
        type: 'POINTCLOUD_SELECT_BY_ID',
        payload: {
            pointCloudId: pointCloudId
        }
    };
};

/** This will toggle pointcloud selection/deselection.<br>
 * Used instead of clickPointcloud when only the pointcloud id is known.
 * @param {Object} params
 * @param {string} params.pointClouId - the id of the pointCloud to select (can be undefined)
 */
export const selectPointCloudById = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_SELECT_BY_ID',
        payload: {
            pointCloudId: pointCloudId
        }
    };
};

export const initSelectedPointCloud = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_INIT_SELECTED',
        payload: axios.get('/potreeviewer/potreedataset/' + pointCloudId)
    };
};

/** This is action TOGGLE POINT CLOUD */
export const togglePointCloud = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_TOGGLE',
        payload: {
            pointCloudId
        },
        meta: {
            validator: {
                pointCloudId: {
                    func: _pointCloudId => typeof _pointCloudId === 'string',
                    msg: 'pointCloudId must be a string'
                }
            }
        }
    };
};
