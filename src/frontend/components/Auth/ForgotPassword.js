import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import PropTypes from 'prop-types';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../modules';
const { forgotPassword, resetForgotPasswordState } = actions;
import { selectors } from '../../modules';
const { getRootUrl, getForgotPasswordState, getAuthUser } = selectors;

import Form from '../Common/Form';
import styles from '../Common/Form/form.css';

class ForgotPassword extends React.Component {
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
            this.props.dispatch(resetForgotPasswordState());
        }, 500);
    }

    submit(form) {
        this.props.dispatch(forgotPassword(form));
    }

    render() {
        const fields = {
            email: {
                label: 'Email',
                type: 'email',
                required: true,
                validate: value => {
                    const isValid = isEmail(value);
                    const error = isValid ? '' : 'Email is invalid';
                    return { isValid, error };
                }
            }
        };
        const links = [];
        const helper = 'Please enter your email to reset your password';
        const error =
            this.props.serverState.error ||
            (this.state.verifyError && !this.props.serverState.data
                ? 'Your reset session has expired. Please ask for a new session below.'
                : null);

        return (
            <Dialog
                title="Forgot Password"
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
ForgotPassword.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** current router history, provided by function withRouter */
    history: PropTypes.object.isRequired,

    /** current route location, provided by function withRouter */
    location: PropTypes.object.isRequired,

    /** current route match, provided by function withRouter */
    match: PropTypes.object,

    /** current map url (with position & zoom), provided by connect */
    rootUrl: PropTypes.string.isRequired,

    /** state of the request FORGOT_PASSWORD, provided by connect */
    serverState: PropTypes.shape({
        /** boolean, true if a request is on going */
        pending: PropTypes.bool,
        /** contains success message once the request is finished */
        data: PropTypes.string,
        /** contains an error string if user account could not be retrieved */
        error: PropTypes.string
    }).isRequired,

    /** currently authenticated user, provided by connect */
    user: PropTypes.object
};

// Store connection
const ConnectedForgotPassword = connect(store => {
    return {
        rootUrl: getRootUrl(store),
        serverState: getForgotPasswordState(store),
        user: getAuthUser(store)
    };
})(ForgotPassword);

export default ConnectedForgotPassword;
