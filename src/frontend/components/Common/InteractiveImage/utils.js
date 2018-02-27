/** Transforms canvas-relative coords into normalized image-relative coords
 * canvas origin is NW, image origin is at the center of the image
 */
export const canvasToImageFactory = (imgNWCorner, imgDim) => {
    return canvasCoords => {
        return {
            x: 2 * (canvasCoords.x - imgNWCorner.x) / imgDim.width - 1,
            y: 2 * (canvasCoords.y - imgNWCorner.y) / imgDim.height - 1
        };
    };
};

/** Transforms normalized image-relative coords into canvas-relative coords
 * canvas origin is NW, image origin is at the center of the image
 */
export const imageToCanvasFactory = (imgNWCorner, imgDim) => {
    return imageCoords => {
        return {
            x: imgNWCorner.x + imgDim.width * (1 + imageCoords.x) / 2,
            y: imgNWCorner.y + imgDim.height * (1 + imageCoords.y) / 2
        };
    };
};

export const isCanvasPointIntoImageFactory = (imgNWCorner, imgDim) => {
    return canvasCoords => {
        return (
            canvasCoords.x >= imgNWCorner.x &&
            canvasCoords.x <= imgNWCorner.x + imgDim.width &&
            canvasCoords.y >= imgNWCorner.y &&
            canvasCoords.y <= imgNWCorner.y + imgDim.height
        );
    };
};

export const intersectFactory = (imgNWCorner, imgDim, pointSize) => {
    return (canvasPoint, imagePoints) => {
        const intersectedPoints = [];
        imagePoints.map(_point => {
            const _canvasPoint = imageToCanvasFactory(imgNWCorner, imgDim)(_point);
            if (
                canvasPoint.x >= _canvasPoint.x - pointSize &&
                canvasPoint.x <= _canvasPoint.x + pointSize &&
                canvasPoint.y >= _canvasPoint.y - pointSize &&
                canvasPoint.y <= _canvasPoint.y + pointSize
            ) {
                intersectedPoints.push({ ..._canvasPoint, id: _point.id });
            }
        });
        return intersectedPoints;
    };
};
