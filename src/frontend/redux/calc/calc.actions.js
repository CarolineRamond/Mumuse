import * as calc from './calc.utils.js';

/** Launch a calc to compute camera parameters.
 * @param {Object} camera - the current 3D camera.
 * @param {Array} bindings - the 2D-3D point bindings to use for computation
 */
export const launchCalc = (bindings, camera) => {
    return dispatch => {
        dispatch({
            type: 'LAUNCH_CALC_PENDING'
        });
        switch (bindings.length) {
            case 1: {
                const data = calc.fixFirst(bindings[0], camera);
                return setTimeout(() => {
                    return dispatch({
                        type: 'LAUNCH_CALC_FULFILLED',
                        payload: {
                            data: data
                        }
                    });
                }, 1000);
            }
            case 2: {
                const data = calc.fixSecond(bindings[0], bindings[1], camera);
                return setTimeout(() => {
                    if (data.error) {
                        return dispatch({
                            type: 'LAUNCH_CALC_REJECTED',
                            payload: {
                                error: data.error
                            }
                        });
                    } else {
                        return dispatch({
                            type: 'LAUNCH_CALC_FULFILLED',
                            payload: {
                                data: data
                            }
                        });
                    }
                }, 1000);
            }
            case 3: {
                const data = calc.fixThird(bindings[0], bindings[1], bindings[2], camera);
                return setTimeout(() => {
                    if (data.error) {
                        return dispatch({
                            type: 'LAUNCH_CALC_REJECTED',
                            payload: {
                                error: data.error
                            }
                        });
                    } else {
                        return dispatch({
                            type: 'LAUNCH_CALC_FULFILLED',
                            payload: {
                                data: data
                            }
                        });
                    }
                }, 1000);
            }
            default: {
                return dispatch({
                    type: 'LAUNCH_CALC_FULFILLED'
                });
            }
        }
    };
};

/** Select a solution among those computed.
 * @param {Number} solutionIndex - the index of the solution to select
 */
export const selectCalcSolution = solutionIndex => {
    return {
        type: 'CALC_SELECT_SOLUTION',
        payload: {
            solutionIndex: solutionIndex
        },
        meta: {
            validator: {
                solutionIndex: {
                    func: _solutionIndex => {
                        return (
                            typeof _solutionIndex === 'number' && Number.isInteger(_solutionIndex)
                        );
                    },
                    msg: 'solutionIndex must be an integer'
                }
            }
        }
    };
};
