import React from "react";
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import PropTypes from "prop-types"
import Dialog from "react-toolbox/lib/dialog"

import { actions } from '../../modules'
const { login } = actions;
import { selectors } from '../../modules'
const { getLoginState, getRootUrl } = selectors;

import Form from '../Common/Form'
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
// * rootUrl: current map url (with position & zoom), provided by @connect (required)
// * serverState : state of the request LOGIN, provided by connect (required)
// *    pending: boolean, true if a request is on going
// *    data: contains success message once the request is finished
// *    error: contains an error string if user could not login
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter 
// * history : current router history, provided by function withRouter (required)
Login.propTypes = {
	rootUrl: PropTypes.string.isRequired,
	 serverState : PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.object,
        error: PropTypes.string
    }).isRequired,
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedLogin = connect((store)=> {
	return {
		rootUrl: getRootUrl(store),
		serverState: getLoginState(store)
	}
})(Login);

export default ConnectedLogin;