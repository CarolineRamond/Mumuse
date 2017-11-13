import React from "react";
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import PropTypes from "prop-types"
import Dialog from "react-toolbox/lib/dialog"

import Form from '../Common/Form'
import { getLoginState } from '../../modules/auth'
import { login } from '../../modules/auth/auth.actions'
import { getRootUrl } from '../../modules/world'
import styles from '../Common/form.css'

class Login extends React.Component {

	constructor(props) {
		super(props);
		const search = this.props.location.search;
		this.state = {
			active: false,
			verifySuccess: /verifySuccess=true/.test(search)
		};
		this.cancel = this.cancel.bind(this);
		this.submit = this.submit.bind(this);
	}

	cancel() {
		this.setState({
		    active: false
		});
		setTimeout(()=> {
		    this.props.history.push(this.props.rootUrl);
		}, 500);
	}

	submit(form) {
		this.props.dispatch(login(form));
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

	render() {
		const registerUrl = this.props.rootUrl + '/auth/register'
		const forgotUrl = this.props.rootUrl + '/auth/forgot';
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
		}];
		const success = this.state.verifySuccess ? 
			"Your account was successfully verified. You can now login." : null;
				
		return <Dialog title="Login" 
            active={this.state.active}
            onEscKeyDown={this.cancel}
            onOverlayClick={this.cancel}
            theme={{
            	dialog: styles.formDialogContainer,
            	body: styles.formDialog,
            	title: styles.formDialogTitle
            }}>
            <Form fields={fields}
                helper=""
                success={success}
                error={this.props.serverState.error}
                links={links}
                cancel={this.cancel}
                submit={this.submit}
            />
        </Dialog>
	}
}

// Props :
// * user : currently logged in user (if any), provided by @connect
// * location : current route location, provided by function withRouter 
// * match : current route match, provided by function withRouter (required)
// * history : current router history, provided by function withRouter (required)
Login.propTypes = {
    location: PropTypes.object, 
    match: PropTypes.object.isRequired, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedLogin = connect((store)=> {
	return {
		rootUrl: getRootUrl(store.world),
		serverState: getLoginState(store.auth)
	}
})(Login);

export default ConnectedLogin;