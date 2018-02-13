import axios from 'axios';

const isArrayOfFeatures = x => {
    if (Array.isArray(x)) {
        const typeCheck = x.reduce((bool, item) => {
            return bool && item.constructor.name === 'Feature';
        }, true);
        return typeCheck;
    }
    return false;
};

export const clickPointCloud = ({ features, ctrlKey, isAdmin }) => {
    return {
        type: 'POINTCLOUD_CLICK',
        payload: {
            features: features,
            ctrlKey: ctrlKey,
            isAdmin: isAdmin
        }
    };
};

export const initSelectedPointCloud = ({ pointCloudId }) => {
    return {
        type: 'POINTCLOUD_INIT_SELECTED',
        payload: axios.get('/potreeviewer/potreedataset/' + pointCloudId)
    };
};

export const updateFeaturesPointCloud = ({ features }) => {
    return {
        type: 'POINTCLOUD_UPDATE_FEATURES',
        payload: { features },
        meta: {
            validator: {
                features: {
                    func: _features => isArrayOfFeatures(_features),
                    msg: 'features must be an array of mapbox features'
                }
            }
        }
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
