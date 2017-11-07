import React from "react";
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import PropTypes from "prop-types"

import Form from '../Common/Form'
import { login } from '../../modules/auth/auth.actions'

class Login extends React.Component {
	render() {
		const url = this.props.match.url.split('/');
		const rootUrl = url.slice(0, url.length-2).join('/');
		const registerUrl = url.slice(0, url.length-1).concat('register').join('/');
		const forgotUrl = url.slice(0, url.length-1).concat('forgot').join('/');
		const fields = {
			email: {
				label: "Email",
				type: "email",
				required: true,
				validate: (value)=> {
					const isValid = isEmail(value);
				    const error = isValid ? '' : 'Email is invalid';
				    return { isValid, error }
				}
			},
			password: {
				label: "Password",
				type: "password",
				required: true,
				validate: (value)=> {
					const isValid = isLength(value, { min: 8 });
				    const error = isValid ? '' : 'Password is too short';
				    return { isValid, error }
				}
			}
		};
		const links = [{
			to: registerUrl,
			text: "Create Account"
		}, {
			to: forgotUrl,
			text: "Forgot Password ?"
		}]
		const submit = (form)=> {
			this.props.dispatch(login(form));
		}
		const cancel = ()=> {
			this.props.history.push(rootUrl);
		}
				
		if (this.props.user) {
			return <Redirect to={rootUrl}/>
		} else {
			return <Form title="Login"
				fields={fields}
				submit={submit}
				cancel={cancel}
				links={links}
				helper=""
			/>
		}
	}
}

// Props :
// * user : currently logged in user (if any), provided by @connect
// * location : current route location, provided by function withRouter 
// * match : current route match, provided by function withRouter (required)
// * history : current router history, provided by function withRouter (required)
Login.propTypes = {
	user: PropTypes.object,
    location: PropTypes.object, 
    match: PropTypes.object.isRequired, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedLogin = connect((store)=> {
	return {
		user: store.auth.user,
	}
})(Login);

export default ConnectedLogin;