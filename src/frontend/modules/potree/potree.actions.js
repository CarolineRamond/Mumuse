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
