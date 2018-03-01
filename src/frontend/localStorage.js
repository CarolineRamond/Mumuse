import { forIn } from 'lodash';

const clearHistory = obj => {
    const clearedObject = {};
    forIn(obj, function(value, key) {
        if (key === 'future') {
            clearedObject[key] = [];
        } else if (key === 'past') {
            clearedObject[key] = [];
        } else if (key === 'history') {
            clearedObject[key] = {
                future: [],
                past: [],
                present: value.present
            };
        } else if (value === null) {
            clearedObject[key] = null;
        } else if (typeof value === 'object' && !Array.isArray(value)) {
            clearedObject[key] = clearHistory(value);
        } else {
            clearedObject[key] = value;
        }
    });
    return clearedObject;
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = state => {
    try {
        const clearedState = clearHistory(state);
        const serializedState = JSON.stringify(clearedState);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        console.log('Error persisting state to local storage : ', err);
    }
};
