import React from 'react';
import { connect } from 'react-redux';
import isLength from 'validator/lib/isLength';
import PropTypes from 'prop-types';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../modules';
const { resetPassword, resetResetPasswordState } = actions;
import { selectors } from '../../modules';
const { getRootUrl, getResetPasswordState } = selectors;

import Form from '../Common/Form';
import styles from '../Common/Form/form.css';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        const search = this.props.location.search;
        this.state = {
            active: false
        };
        this.token = search.slice(7, search.length);
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
            this.props.dispatch(resetResetPasswordState());
        }, 500);
    }

    submit(form) {
        this.props.dispatch(resetPassword(form, this.token));
    }

    render() {
        const fields = {
            password: {
                label: 'New Password',
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
                label: 'Confirm New Password',
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
        const helper = 'Please enter your new password below';

        return (
            <Dialog
                title="Reset Password"
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
                    helper={helper}
                    error={this.props.serverState.error}
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
// * serverState : state of the request RESET_PASSWORD, provided by connect (required)
// *    pending: boolean, true if a request is on going
// *    data: contains success message once the request is finished
// *    error: contains an error string if password could not be reset
ResetPassword.propTypes = {
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
const ConnectedResetPassword = connect(store => {
    return {
        serverState: getResetPasswordState(store),
        rootUrl: getRootUrl(store)
    };
})(ResetPassword);

export default ConnectedResetPassword;
