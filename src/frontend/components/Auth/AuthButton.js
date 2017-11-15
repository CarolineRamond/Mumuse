import React from "react";
import { connect } from "react-redux"
import { withRouter } from "react-router"
import Button from "react-toolbox/lib/button"
import Tooltip from "react-toolbox/lib/tooltip"
const TooltipButton = Tooltip(Button);
import PropTypes from "prop-types"

import { authButton } from './auth.css'
import { getRootUrl } from "../../modules/world"
import { getAuthUser } from "../../modules/auth"
import { logout } from '../../modules/auth/auth.actions'

class AuthButton extends React.Component {

	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return (nextProps.user && !this.props.user) ||
			(!nextProps.user && this.props.user) ||
			(nextProps.user && this.props.user && nextProps.user.email !== this.props.user.email);
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
			return <TooltipButton
				icon='directions_run' 
				onClick={this.logout}
				floating 
				className={authButton}
				tooltip="Logout"/>
		} else {
			return <TooltipButton 
				icon='account_box' 
				floating 
				className={authButton}
				tooltip="Login"
				onClick={this.login}/>
		}
	}
}

// Props :
// * user : currently logged in user (if any), provided by @connect
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter (required)
AuthButton.propTypes = {
	user: PropTypes.object
}

// Store connection
const ConnectedAuthButton = connect((store)=> {
	return {
		user: getAuthUser(store.auth),
		rootUrl: getRootUrl(store.world)
	}
})(AuthButton);

export default withRouter(ConnectedAuthButton)

