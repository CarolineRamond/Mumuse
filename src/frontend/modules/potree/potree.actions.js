import axios from 'axios';

/** This will fetch all available pointclouds as a feature collection from the server.<br>
 * Called once on init.
 * @returns {Object} action - type 'POINTCLOUD_FETCH'
 */
export const fetchPointClouds = () => {
    return {
        type: 'POINTCLOUD_FETCH',
        payload: axios.get('/potreeviewer/potreedataset')
    };
};

/** This will toggle pointcloud selection on init.<br>
 * @param {Object} params
 * @param {string} params.pointCloudId - the id of the initially selected pointcloud
 * @returns {Object} action - type 'POINTCLOUD\_INIT\_SELECTED'
 */
export const initSelectedPointCloud = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_INIT_SELECTED',
        payload: { pointCloudId: pointCloudId }
    };
};

/** This will toggle pointcloud selection/deselection.<br>
 * @param {Object} params
 * @param {Array} params.features - the clicked mapbox features,
 * either pointcloud features (feature.layer.id='pointClouds-layer'),
 * either media features (feature.layer.id='medias-layer').<br>
 * In case no pointcloud feature is clicked, check if any of the clicked media
 * has an associated pointcloud and select it
 * @returns {Object} action - type 'POINTCLOUD\_SELECT\_BY\_ID'
 */
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
 * (different from initSelectedPointCloud)
 * @param {Object} params
 * @param {string} params.pointCloudId - the id of the pointCloud to select (can be undefined)
 * @returns {Object} action - type 'POINTCLOUD\_SELECT\_BY\_ID'
 */
export const selectPointCloudById = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_SELECT_BY_ID',
        payload: {
            pointCloudId: pointCloudId
        }
    };
};

/** This will toggle pointcloud visibility.<br>
 * @param {Object} params
 * @param {string} params.pointClouId - the id of the pointCloud to show/hide
 * @returns {Object} action - type 'POINTCLOUD\_TOGGLE'
 */
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
