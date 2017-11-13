import React from "react";
import { Redirect } from "react-router-dom"
import { connect } from "react-redux"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import PropTypes from "prop-types"
import Dialog from "react-toolbox/lib/dialog"

import Form from '../Common/Form'
import { register } from '../../modules/auth/auth.actions'
import { getRootUrl } from '../../modules/world'
import { getRegisterState } from "../../modules/auth"
import styles from "../Common/form.css"

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			active: false
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
		this.props.dispatch(register(form));
	}

	componentDidMount() {
		this.setState({
			active: true
		});
	}

	render() {
		const fields = {
			firstname: {
				label: "First Name",
				type: "text",
				required: true,
				validate: (value)=> {
					const isValid = (value.length > 0);
				    const error = isValid ? '' : 'First name is required';
				    return { isValid, error }
				}
			},
			lastname: {
				label: "Last Name",
				type: "text",
				required: true,
				validate: (value)=> {
					const isValid = (value.length > 0);
				    const error = isValid ? '' : 'Last name is required';
				    return { isValid, error }
				}
			},
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
			    	var errors = [];
			    	var isValid = true;
			    	if (!isLength(value, { min: 8 })) {
			    		isValid = false;
			    		errors.push(<div key="error-length"
			    			style={{width:"250px"}}>
			    			Password is too short
			    			</div>);
			    	}
			    	if (!/\d/.test(value)) {
			    		isValid = false;
			    		errors.push(<div key="error-digit"
			    			style={{width:"250px"}}>
			    			Password should contain at least one number
			    			</div>);
			    	}
			    	if (!/[a-z]/.test(value)) {
			    		isValid = false;
			    		errors.push(<div key="error-lc"
			    			style={{width:"250px"}}>
			    			Password should contain at least one lowercase character
			    			</div>);
			    	}
			    	if (!/[A-Z]/.test(value)) {
			    		isValid = false;
			    		errors.push(<div key="error-uc"
			    			style={{width:"250px"}}>
			    			Password should contain at least one uppercase character
			    			</div>);
			    	}
			    	if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) {
			    		isValid = false;
			    		errors.push(<div key="error-special"
			    			style={{width:"250px"}}>
			    			Password should contain at least one special character (*,!,etc)
			    			</div>);
			    	}
			    	var error = '';
			    	if (errors.length > 0) {
			    		error = <div>{errors}</div>
			    	}
			    	return { isValid, error }
				}
			},
			confirmPassword: {
				label: "Confirm Password",
				type: "password",
				required: true,
				refValue: "password",
				validate: (value, refValue)=> {
					const isValid = (value === refValue);
				    const error = isValid ? '' : 'Passwords do not match';
				    return { isValid, error }
				}
			}
		};
		const links = []
		
		return <Dialog title="Register" 
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
                error={this.props.serverState.error}
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
Register.propTypes = {
    location: PropTypes.object, 
    match: PropTypes.object.isRequired, 
    history: PropTypes.object.isRequired
}

// Store connection
const ConnectedRegister = connect((store)=> {
	return {
		serverState: getRegisterState(store.auth),
		rootUrl: getRootUrl(store.world)
	}
})(Register);

export default ConnectedRegister;