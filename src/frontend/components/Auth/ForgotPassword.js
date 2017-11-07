import React from "react";
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import PropTypes from "prop-types"

import AuthForm from './AuthForm'
import { forgotPassword } from '../../modules/auth/auth.actions'

class ForgotPassword extends React.Component {
	render() {
		const url = this.props.match.url.split('/');
		const rootUrl = url.slice(0, url.length-2).join('/');
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
			}
		};
		const links = []
		const submit = (form)=> {
			this.props.dispatch(forgotPassword(form));
		}
		const cancel = ()=> {
			this.props.history.push(rootUrl);
		}
		const helper = "Please enter your email to reset your password";
				
		return <AuthForm title="Forgot Password"
			fields={fields}
			submit={submit}
			cancel={cancel}
			links={links}
			helper={helper}
		/>
	}
}

// Props :
// * location : current route location, provided by function withRouter 
// * match : current route match, provided by function withRouter (required)
// * history : current router history, provided by function withRouter (required)
ForgotPassword.propTypes = {
    location: PropTypes.object, 
    match: PropTypes.object.isRequired, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedForgotPassword = connect((store)=> {
	return {}
})(ForgotPassword);

export default ConnectedForgotPassword;