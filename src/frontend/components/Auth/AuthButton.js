import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
const TooltipButton = Tooltip(Button);
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { logout } = actions;
import { selectors } from '../../modules';
const { getAuthUser, getRootUrl } = selectors;

import { authButton } from './auth.css';

export class AuthButton extends React.Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return (
            (nextProps.user && !this.props.user) ||
            (!nextProps.user && this.props.user) ||
            (nextProps.user && this.props.user && nextProps.user.email !== this.props.user.email)
        );
    }

    login() {
        const loginUrl = this.props.rootUrl + '/auth/login';
        this.props.history.push(loginUrl);
    }

    logout() {
        this.props.dispatch(logout());
    }

    render() {
        if (this.props.user) {
            return (
                <TooltipButton
                    icon="directions_run"
                    onClick={this.logout}
                    floating
                    className={authButton}
                    tooltip="Logout"
                />
            );
        } else {
            return (
                <TooltipButton
                    icon="account_box"
                    floating
                    className={authButton}
                    tooltip="Login"
                    onClick={this.login}
                />
            );
        }
    }
}

AuthButton.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** current router history, provided by function withRouter */
    history: PropTypes.object.isRequired,

    /** current route location, provided by function withRouter */
    location: PropTypes.object,

    /** current route match, provided by function withRouter */
    match: PropTypes.object,

    /** current map url (with position & zoom), provided by connect */
    rootUrl: PropTypes.string.isRequired,

    /** currently logged in user (if any), provided by connect */
    user: PropTypes.object
};

// Store connection
const ConnectedAuthButton = connect(store => {
    return {
        user: getAuthUser(store),
        rootUrl: getRootUrl(store)
    };
})(AuthButton);

export default withRouter(ConnectedAuthButton);
