import React from "react";
import { connect } from "react-redux"
import Button from "react-toolbox/lib/button"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"

import { authButton } from './auth.css'
import { logout } from '../../modules/auth/auth.actions'

@connect((store)=> {
	return {
		user: store.auth.user,
	}
})

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
			return <Button 
				icon='directions_run' 
				onClick={this.logout}
				floating 
				className={authButton}/>
		} else {
			return <Link to={this.loginUrl}>
				<Button 
				icon='account_box' 
				floating 
				className={authButton}/>
			</Link>
		}
	}
}

export default withRouter(AuthButton)

