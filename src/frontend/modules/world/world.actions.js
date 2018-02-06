export function updateWorldState({ lng, lat, zoom, bounds }) {
    return {
        type: 'UPDATE_WORLD_STATE',
        payload: {
            lat,
            lng,
            zoom,
            bounds
        },
        meta: {
            validator: {
                lat: {
                    func: _lat => typeof _lat === 'number',
                    msg: 'lat must be a number'
                },
                lng: {
                    func: _lng => typeof _lng === 'number',
                    msg: 'lng must be a number'
                },
                zoom: {
                    func: _zoom => typeof _zoom === 'number',
                    msg: 'zoom must be a number'
                },
                bounds: {
                    func: _bounds => {
                        if (Array.isArray(_bounds) && _bounds.length === 4) {
                            const isArrayOfNumbers = _bounds.reduce((bool, item) => {
                                return bool && typeof item === 'number';
                            }, true);
                            return isArrayOfNumbers;
                        }
                        return false;
                    },
                    msg: 'bounds must be an array of four numbers'
                }
            }
        }
    };
}

export function switchPreviewMode() {
    return {
        type: 'SWITCH_PREVIEW_MODE'
    };
}

export const toggleLayer = ({ layerId }) => {
    return {
        type: 'TOGGLE_LAYER',
        payload: {
            layerId
        },
        meta: {
            validator: {
                layerId: {
                    func: _layerId => typeof _layerId === 'string',
                    msg: 'LayerId must be a string'
                }
            }
        }
    };
};
