import React from "react";
import { connect } from "react-redux"
import Button from "react-toolbox/lib/button"
import Tooltip from "react-toolbox/lib/tooltip"
const TooltipButton = Tooltip(Button);
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import PropTypes from "prop-types"

import { authButton } from './auth.css'
import { logout } from '../../modules/auth/auth.actions'

class AuthButton extends React.Component {

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		this.loginUrl = this.props.location.pathname + '/auth/login';
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
			return <Link to={this.loginUrl}>
				<TooltipButton 
				icon='account_box' 
				floating 
				className={authButton}
				tooltip="Login"/>
			</Link>
		}
	}
}

// Props :
// * user : currently logged in user (if any), provided by @connect
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter (required)
AuthButton.propTypes = {
	user: PropTypes.object,
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedAuthButton = connect((store)=> {
	return {
		user: store.auth.user,
	}
})(AuthButton);

export default withRouter(ConnectedAuthButton)

