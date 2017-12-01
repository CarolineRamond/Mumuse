import axios from 'axios';

export const fetchRastertilesets = () => {
    return {
        type: 'FETCH_RASTERTILESETS',
        payload: axios.get('/map/rastertile')
    };
};
