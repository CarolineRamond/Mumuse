/** Add a point to the 2d photo.
 * @param {Object} params - new point params
 * @param {Number} params.x - x-coordinate.
 * Must be between -1 (left edge of the photo) and 1 (right edge of the photo)
 * @param {Number} params.y - y-coordinate.
 * Must be between -1 (bottom edge of the photo) and 1 (top edge of the photo)
 * @param {String} [params.name] - a name to identify the point
 */
export const add2DPoint = ({ x, y, name }) => {
    return {
        type: '2D_POINT_ADD',
        payload: {
            x: x,
            y: y,
            name: name
        },
        meta: {
            validator: {
                x: {
                    func: _x => {
                        return typeof _x === 'number' && _x <= 1 && _x >= -1;
                    },
                    msg: 'x must be a number between -1 and 1.'
                },
                y: {
                    func: _y => {
                        return typeof _y === 'number' && _y <= 1 && _y >= -1;
                    },
                    msg: 'y must be a number between -1 and 1.'
                }
            }
        }
    };
};

/** Remove a point from the 2d photo.
 * @param {String} pointId - the id of the 2d point to remove.
 */
export const remove2DPoint = pointId => {
    return {
        type: '2D_POINT_REMOVE',
        payload: {
            pointId: pointId
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                }
            }
        }
    };
};

/** Update a point from the 2d photo.
 * @param {String} pointId - the id of the 2d point to update.
 * @params {Object} params - new point params
 * @param {Number} params.x - new x-coordinate.
 * Must be between -1 (left edge of the photo) and 1 (right edge of the photo)
 * @param {Number} params.y - new y-coordinate.
 * Must be between -1 (bottom edge of the photo) and 1 (top edge of the photo)
 * @param {String} [params.name] - a new name to identify the point
 */
export const update2DPoint = (pointId, { x, y, name }) => {
    return {
        type: '2D_POINT_UPDATE',
        payload: {
            pointId: pointId,
            x: x,
            y: y,
            name: name
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                },
                x: {
                    func: _x => {
                        return typeof _x === 'number' && _x <= 1 && _x >= -1;
                    },
                    msg: 'x must be a number between -1 and 1.'
                },
                y: {
                    func: _y => {
                        return typeof _y === 'number' && _y <= 1 && _y >= -1;
                    },
                    msg: 'y must be a number between -1 and 1.'
                }
            }
        }
    };
};

/** Select a point from the 2d photo.
 * @param {String} pointId - the id of the 2d point to select.
 */
export const toggle2DPointSelection = pointId => {
    return {
        type: '2D_POINT_TOGGLE_SELECT',
        payload: {
            pointId: pointId
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                }
            }
        }
    };
};

/** Add a point to the 3d model.
 * @param {Object} params - new point params
 * @param {Number} params.x - x-coordinate.
 * @param {Number} params.y - y-coordinate.
 * @param {Number} params.z - z-coordinate.
 * @param {String} [params.name] - a name to identify the point
 */
export const add3DPoint = ({ x, y, z, name }) => {
    return {
        type: '3D_POINT_ADD',
        payload: {
            x: x,
            y: y,
            z: z,
            name: name
        },
        meta: {
            validator: {
                x: {
                    func: _x => {
                        return typeof _x === 'number';
                    },
                    msg: 'x must be a number.'
                },
                y: {
                    func: _y => {
                        return typeof _y === 'number';
                    },
                    msg: 'y must be a number.'
                },
                z: {
                    func: _z => {
                        return typeof _z === 'number';
                    },
                    msg: 'z must be a number.'
                }
            }
        }
    };
};

/** Remove a point from the 3d model.
 * @param {String} pointId - the id of the 3d point to remove.
 */
export const remove3DPoint = pointId => {
    return {
        type: '3D_POINT_REMOVE',
        payload: {
            pointId: pointId
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                }
            }
        }
    };
};

/** Update a point from the 3d model.
 * @param {String} pointId - the id of the 3d point to remove.
 * @param {Object} params - new point params
 * @param {Number} params.x - new x-coordinate.
 * @param {Number} params.y - new y-coordinate.
 * @param {Number} params.z - new z-coordinate.
 * @param {String} [params.name] - a new name to identify the point
 */
export const update3DPoint = (pointId, { x, y, z, name }) => {
    return {
        type: '3D_POINT_UPDATE',
        payload: {
            pointId: pointId,
            x: x,
            y: y,
            z: z,
            name: name
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                },
                x: {
                    func: _x => {
                        return typeof _x === 'number';
                    },
                    msg: 'x must be a number.'
                },
                y: {
                    func: _y => {
                        return typeof _y === 'number';
                    },
                    msg: 'y must be a number.'
                },
                z: {
                    func: _z => {
                        return typeof _z === 'number';
                    },
                    msg: 'z must be a number.'
                }
            }
        }
    };
};

/** Select a point from the 3d photo.
 * @param {String} pointId - the id of the 3d point to remove.
 */
export const toggle3DPointSelection = pointId => {
    return {
        type: '3D_POINT_TOGGLE_SELECT',
        payload: {
            pointId: pointId
        },
        meta: {
            validator: {
                pointId: {
                    func: _pointId => {
                        return typeof _pointId === 'string';
                    },
                    msg: 'pointId must be a string'
                }
            }
        }
    };
};

/** Toggle ortho camera mode.
 */
export const toggleOrthoCamera = () => {
    return {
        type: 'CAMERA_TOGGLE_ORTHO'
    };
};

/** Update camera focal length (in case ortho mode isn't toggled).
 * @param {Number} newFocal - the new camera focal length.
 */
export const updateCameraFocal = newFocal => {
    return {
        type: 'CAMERA_UPDATE',
        payload: {
            focal: newFocal
        },
        meta: {
            validator: {
                focal: {
                    func: _focal => {
                        return typeof _focal === 'number';
                    },
                    msg: 'focal must be a number'
                }
            }
        }
    };
};

/** Update camera zoom (in case ortho mode is toggled).
 * @param {Number} newZoom - the new camera zoom.
 */
export const updateCameraZoom = newZoom => {
    return {
        type: 'CAMERA_UPDATE',
        payload: {
            zoom: newZoom
        },
        meta: {
            validator: {
                zoom: {
                    func: _zoom => {
                        return typeof _zoom === 'number';
                    },
                    msg: 'zoom must be a number'
                }
            }
        }
    };
};

/** Link a 2d point to a 3d point.
 * @param {Number} pointId2D - the id of the 2D point.
 * @param {Number} pointId3D - the id of the 3D point.
 */
export const addBinding = (pointId2D, pointId3D) => {
    return {
        type: 'BINDING_ADD',
        payload: {
            pointId2D: pointId2D,
            pointId3D: pointId3D
        },
        meta: {
            validator: {
                pointId2D: {
                    func: _pointId2D => {
                        return typeof _pointId2D === 'string';
                    },
                    msg: 'pointId2D must be a string'
                },
                pointId3D: {
                    func: _pointId3D => {
                        return typeof _pointId3D === 'string';
                    },
                    msg: 'pointId3D must be a string'
                }
            }
        }
    };
};

/** Remove a link between a 2d point and a 3d point using 2d point id.
 * @param {Number} pointId2D - the id of the 2D point.
 */
export const removeBindingBy2D = pointId2D => {
    return {
        type: 'BINDING_REMOVE_BY_2D',
        payload: {
            pointId2D: pointId2D
        },
        meta: {
            validator: {
                pointId2D: {
                    func: _pointId2D => {
                        return typeof _pointId2D === 'string';
                    },
                    msg: 'pointId2D must be a string'
                }
            }
        }
    };
};

/** Remove a link between a 2d point and a 3d point using 3d point id.
 * @param {Number} pointId3D - the id of the 3D point.
 */
export const removeBindingBy3D = pointId3D => {
    return {
        type: 'BINDING_REMOVE_BY_3D',
        payload: {
            pointId3D: pointId3D
        },
        meta: {
            validator: {
                pointId3D: {
                    func: _pointId3D => {
                        return typeof _pointId3D === 'string';
                    },
                    msg: 'pointId3D must be a string'
                }
            }
        }
    };
};
