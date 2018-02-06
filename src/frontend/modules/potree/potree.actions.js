import axios from 'axios';

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
