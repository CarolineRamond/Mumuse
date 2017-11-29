export default function (options = { validatorKey: 'meta', paramKey: 'payload' }) {
    const validatorMiddleware = store => next => action => {
        if (!action[options.validatorKey] || !action[options.validatorKey].validator || action[options.validatorKey].disableValidate) {
            // thunk compatible
            if (action[options.paramKey] && action[options.paramKey].thunk) {
                return next(action[options.paramKey].thunk);
            } else {
                return next(action);
            }
        }

        let flag = true;
        let errorParam, errorId, errorMsg;

        const validators = action[options.validatorKey].validator || {};

        const runValidator = (param, func, msg, id, key) => {
            let _flag;
            if (func) {
                _flag = func(param, store.getState(), action.payload);
            } else {
                throw new Error('validator func is needed');
            }
            if (typeof _flag !== 'boolean') {
                throw new Error('validator func must return boolean type');
            }
            if (!_flag) {
                errorParam = key;
                errorId = id;
                errorMsg = msg || '';
            }

            return _flag;
        };

        const runValidatorContainer = (validator, param, key) => {
            let _flag;
            if (Array.prototype.isPrototypeOf(validator)) {
                for (const j in validator) {
                    if (validator.hasOwnProperty(j)) {
                        const item = validator[j];
                        _flag = runValidator(param, item.func, item.msg, j, key);
                        if (!_flag) break;
                    }
                }
            } else {
                _flag = runValidator(param, validator.func, validator.msg, 0, key);
            }
            return _flag;
        };

        const params = action[options.paramKey] || {};
        for (const i in validators) {
            if (validators.hasOwnProperty(i)) {
                if (!(i === options.paramKey || i === 'thunk')) {
                    const validator = validators[i];

                    flag = runValidatorContainer(validator, params[i], i);
                    if (!flag) break;
                }
            }
        }

        // param object itself
        const paramObjValidator = validators[options.paramKey];
        if (paramObjValidator && flag) {
            flag = runValidatorContainer(paramObjValidator, action[options.paramKey], options.paramKey);
        }
        // -------

        if (flag) {
            // thunk compatible
            if (action[options.paramKey] && action[options.paramKey].thunk) {
                return next(action[options.paramKey].thunk);
            } else {
                return next(action);
            }
        } else {
            console.error(`Abort ${action.type} : ${errorMsg}`);
            return {
                err: 'validator',
                msg: errorMsg,
                param: errorParam,
                id: errorId
            };
        }
    };

    return validatorMiddleware;
}
