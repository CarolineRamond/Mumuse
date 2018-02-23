/** Launch a calc to compute camera parameters.
 * @param {Object} camera3D - the current 3D camera.
 * @param {Array} bindings - the 2D-3D point bindings to use for computation
 */
export const launchAdjustmentCalc = (camera3D, bindings) => {
    return {
        type: 'CALC_LAUNCH',
        payload: {
            camera3D: camera3D,
            bindings: bindings
        }
    };
};

/** Select a solution among those computed.
 * @param {Number} solutionIndex - the index of the solution to select
 */
export const selectAdjustmentCalcSolution = solutionIndex => {
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
