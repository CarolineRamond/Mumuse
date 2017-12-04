import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import PropTypes from 'prop-types';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../modules';
const { register, resetRegisterState } = actions;
import { selectors } from '../../modules';
const { getRegisterState, getRootUrl } = selectors;

import Form from '../Common/Form';
import styles from '../Common/form.css';

class Register extends React.Component {
    constructor(props) {
        super(props);
        const search = this.props.location.search;
        this.state = {
            active: false,
            verifyError: /verifyError=true/.test(search)
        };
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.setState({
            active: true
        });
    }

    cancel() {
        this.setState({
            active: false
        });
        setTimeout(() => {
            this.props.history.push(this.props.rootUrl);
            this.props.dispatch(resetRegisterState());
        }, 500);
    }

    submit(form) {
        this.props.dispatch(register(form));
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
        const links = [];
        const error =
            this.props.serverState.error ||
            (this.state.verifyError
                ? 'Your verification session has expired. Please register again.'
                : null);

        return (
            <Dialog
                title="Register"
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
                    error={error}
                    success={this.props.serverState.data}
                    links={links}
                    cancel={this.cancel}
                    submit={this.submit}
                />
            </Dialog>
        );
    }
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
// * history : current router history, provided by function withRouter (required)
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * rootUrl: current map url (with position & zoom), provided by connect (required)
// * serverState : state of the request REGISTER, provided by connect (required)
// *    pending: boolean, true if a request is on going
// *    data: contains success message once the request is finished
// *    error: contains an error string if user could not register
Register.propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object,
    rootUrl: PropTypes.string.isRequired,
    serverState: PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.string,
        error: PropTypes.string
    }).isRequired
};

// Store connection
const ConnectedRegister = connect(store => {
    return {
        serverState: getRegisterState(store),
        rootUrl: getRootUrl(store)
    };
})(Register);

export default ConnectedRegister;
