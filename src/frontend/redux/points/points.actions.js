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
export const update2DPoint = (pointId, { x, y, name, color }) => {
    return {
        type: '2D_POINT_UPDATE',
        payload: {
            pointId: pointId,
            x: x,
            y: y,
            name: name,
            color: color
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
                        return !_x || (typeof _x === 'number' && _x <= 1 && _x >= -1);
                    },
                    msg: 'x must be a number between -1 and 1.'
                },
                y: {
                    func: _y => {
                        return !_y || (typeof _y === 'number' && _y <= 1 && _y >= -1);
                    },
                    msg: 'y must be a number between -1 and 1.'
                }
            }
        }
    };
};

/** Select a point from the 2d photo.
 * @param {String} pointId - the id of the 2d point to select (can be undefined).
 */
export const select2DPoint = pointId => {
    return {
        type: '2D_POINT_SELECT',
        payload: {
            pointId: pointId
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
export const update3DPoint = (pointId, { x, y, z, name, color }) => {
    return {
        type: '3D_POINT_UPDATE',
        payload: {
            pointId: pointId,
            x: x,
            y: y,
            z: z,
            name: name,
            color: color
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
                        return !_x || typeof _x === 'number';
                    },
                    msg: 'x must be a number.'
                },
                y: {
                    func: _y => {
                        return !_y || typeof _y === 'number';
                    },
                    msg: 'y must be a number.'
                },
                z: {
                    func: _z => {
                        return !_z || typeof _z === 'number';
                    },
                    msg: 'z must be a number.'
                }
            }
        }
    };
};

/** Select a point from the 3d photo.
 * @param {String} pointId - the id of the 3d point to select (can be undefined).
 */
export const select3DPoint = pointId => {
    return {
        type: '3D_POINT_SELECT',
        payload: {
            pointId: pointId
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
 * @param {Number} pointId - the id of the 2D point.
 */
export const removeBindingBy2D = pointId => {
    return {
        type: 'BINDING_REMOVE_BY_2D',
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

/** Remove a link between a 2d point and a 3d point using 3d point id.
 * @param {Number} pointId - the id of the 3D point.
 */
export const removeBindingBy3D = pointId => {
    return {
        type: 'BINDING_REMOVE_BY_3D',
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

/** Select a link between a 2d point and a 3d point using 2d point id.
 * @param {Number} pointId2D - the id of the 2D point.
 */
export const selectBinding = (pointId2D, pointId3D) => {
    return {
        type: 'BINDING_SELECT',
        payload: {
            pointId2D: pointId2D,
            pointId3D: pointId3D
        },
        meta: {
            validator: {
                pointId2D: {
                    func: _pointId2D => {
                        return !_pointId2D || typeof _pointId2D === 'string';
                    },
                    msg: 'pointId2D must be a string'
                },
                pointId3D: {
                    func: _pointId3D => {
                        return !_pointId3D || typeof _pointId3D === 'string';
                    },
                    msg: 'pointId3D must be a string'
                }
            }
        }
    };
};

export const addBindingBuffer2D = point => {
    return {
        type: 'BINDING_BUFFER_ADD_2D',
        payload: {
            point: point
        }
    };
};

export const addBindingBuffer3D = point => {
    return {
        type: 'BINDING_BUFFER_ADD_3D',
        payload: {
            point: point
        }
    };
};
