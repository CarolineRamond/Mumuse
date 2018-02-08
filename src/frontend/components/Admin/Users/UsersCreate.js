import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../../modules';
const { resetCreateState, createUser } = actions;
import { selectors } from '../../../modules';
const { getCreateUserState } = selectors;

import Form from '../../Common/Form';
import styles from '../../Common/Form/form.css';

class UsersCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.setState({
            active: true
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.serverState.data) {
            this.cancel.bind(this)();
        }
    }

    cancel() {
        this.props.dispatch(resetCreateState());
        const rootUrl = '/admin/users';
        this.setState({
            active: false
        });
        setTimeout(() => {
            this.props.history.push(rootUrl);
        }, 500);
    }

    submit(form) {
        this.props.dispatch(createUser(form));
    }

    render() {
        const fields = {
            firstname: {
                label: 'First Name',
                type: 'text',
                required: true,
                validate: value => {
                    const isValid = value.length > 0;
                    const error = isValid ? '' : 'First name is required';
                    return { isValid, error };
                }
            },
            lastname: {
                label: 'Last Name',
                type: 'text',
                required: true,
                validate: value => {
                    const isValid = value.length > 0;
                    const error = isValid ? '' : 'Last name is required';
                    return { isValid, error };
                }
            },
            email: {
                label: 'Email',
                type: 'email',
                required: true,
                validate: value => {
                    const isValid = isEmail(value);
                    const error = isValid ? '' : 'Email is invalid';
                    return { isValid, error };
                }
            },
            roles: {
                label: 'Role',
                type: 'dropdown',
                value: 'user',
                options: [
                    { label: 'User', value: 'user' },
                    { label: 'Superuser', value: 'superuser' },
                    { label: 'Admin', value: 'admin' }
                ],
                validate: () => {
                    return { isValid: true, error: null };
                }
            },
            password: {
                label: 'Password',
                type: 'password',
                required: true,
                validate: value => {
                    const errors = [];
                    let isValid = true;
                    if (!isLength(value, { min: 8 })) {
                        isValid = false;
                        errors.push(
                            <div key="error-length" style={{ width: '250px' }}>
                                Password is too short
                            </div>
                        );
                    }
                    if (!/\d/.test(value)) {
                        isValid = false;
                        errors.push(
                            <div key="error-digit" style={{ width: '250px' }}>
                                Password should contain at least one number
                            </div>
                        );
                    }
                    if (!/[a-z]/.test(value)) {
                        isValid = false;
                        errors.push(
                            <div key="error-lc" style={{ width: '250px' }}>
                                Password should contain at least one lowercase character
                            </div>
                        );
                    }
                    if (!/[A-Z]/.test(value)) {
                        isValid = false;
                        errors.push(
                            <div key="error-uc" style={{ width: '250px' }}>
                                Password should contain at least one uppercase character
                            </div>
                        );
                    }
                    if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) {
                        isValid = false;
                        errors.push(
                            <div key="error-special" style={{ width: '250px' }}>
                                Password should contain at least one special character (*,!,etc)
                            </div>
                        );
                    }
                    let error = '';
                    if (errors.length > 0) {
                        error = <div>{errors}</div>;
                    }
                    return { isValid, error };
                }
            },
            confirmPassword: {
                label: 'Confirm Password',
                type: 'password',
                required: true,
                refValue: 'password',
                validate: (value, refValue) => {
                    const isValid = value === refValue;
                    const error = isValid ? '' : 'Passwords do not match';
                    return { isValid, error };
                }
            }
        };

        return (
            <Dialog
                title="Create User"
                active={this.state.active}
                onEscKeyDown={this.cancel}
                onOverlayClick={this.cancel}
                theme={{
                    dialog: styles.formDialogContainer,
                    body: styles.formDialog,
                    title: styles.formDialogTitle
                }}
            >
                <Form
                    fields={fields}
                    helper=""
                    error={this.props.serverState.error}
                    links={[]}
                    cancel={this.cancel}
                    submit={this.submit}
                />
            </Dialog>
        );
    }
}

UsersCreate.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** current router history, inherited from Route component */
    history: PropTypes.object.isRequired,

    /** current route location, inherited from Route component */
    location: PropTypes.object.isRequired,

    /** current route match, inherited from Route component */
    match: PropTypes.object,

    /** state of the request CREATE\_USER, provided by connect */
    serverState: PropTypes.shape({
        /** true if a request is on going */
        pending: PropTypes.bool,

        /**  contains newly created user (if any) once the request is finished */
        data: PropTypes.object,

        /** contains an error string if user could not be created */
        error: PropTypes.string
    }).isRequired
};

// Store connection
const ConnectedUsersCreate = connect(store => {
    return {
        serverState: getCreateUserState(store)
    };
})(UsersCreate);

export default ConnectedUsersCreate;
