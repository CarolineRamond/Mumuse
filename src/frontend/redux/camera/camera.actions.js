export const updateCamera = camera => {
    return {
        type: 'CAMERA_UPDATE',
        payload: {
            camera: camera
        }
    };
};
