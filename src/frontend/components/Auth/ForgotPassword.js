import React from "react";
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import PropTypes from "prop-types"
import Dialog from "react-toolbox/lib/dialog"

import Form from '../Common/Form'
import { forgotPassword } from '../../modules/auth/auth.actions'
import { getRootUrl } from '../../modules/world'
import { getForgotPasswordState } from "../../modules/auth"
import styles from '../Common/form.css'

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

	cancel() {
		this.setState({
		    active: false
		});
		setTimeout(()=> {
		    this.props.history.push(this.props.rootUrl);
		}, 500);
	}

	submit(form) {
		this.props.dispatch(forgotPassword(form));
	}

	componentDidMount() {
		this.setState({
			active: true
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user) {
			this.cancel.bind(this)();
		}
	}

	render() {
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
		const helper = "Please enter your email to reset your password";
		const error = this.props.serverState.error || (this.state.verifyError ?
			"Your reset session has expired. Please ask for a new session below." : null);
				
		return <Dialog title="Forgot Password" 
            active={this.state.active}
            onEscKeyDown={this.cancel}
            onOverlayClick={this.cancel}
            theme={{
            	dialog: styles.formDialogContainer,
            	body: styles.formDialog,
            	title: styles.formDialogTitle
            }}>
            <Form fields={fields}
                helper={helper}
                error={error}
                success={this.props.serverState.data}
                links={links}
                cancel={this.cancel}
                submit={this.submit}
            />
        </Dialog>
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
	return {
		rootUrl: getRootUrl(store.world),
		serverState: getForgotPasswordState(store.auth)
	}
})(ForgotPassword);

export default ConnectedForgotPassword;