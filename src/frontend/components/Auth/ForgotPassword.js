import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from 'react-toolbox/lib/input';
import isEmail from 'validator/lib/isEmail'

import styles from '../../css/auth.css'

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			formErrors: { email: '' },
			emailValid: false,
			formValid: false
		};
	}

	handleUserInput(name, value) {
		this.setState({
			[name]: value
		}, this.validateField(name, value));
	}

	validateField(name, value) {
		let fieldValidationErrors = this.state.formErrors;
  		let emailValid = this.state.emailValid;

		switch(name) {
		    case 'email':
		    	emailValid = isEmail(value);
		    	fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
		    	break;
		    default:
		    	break;
		}

		this.setState({
			formErrors: fieldValidationErrors,
		    emailValid: emailValid,
		}, this.validateForm);
	}

	validateForm() {
		this.setState({
			formValid: this.state.emailValid
		});
	}

	submit() {
		console.log('SUBMIT');
	}


 	render () {
		return <div className={styles.authPannel}>
			<div className={styles.authPannelTitle}>
				Forgot Password
			</div>
			<div className={styles.authPannelContent}>
				<div className={styles.authPannelLinks}>
					<div>Please enter your email to reset your password</div>
				</div>
				<div className={styles.authPannelForm}>

					<Input type='text' label='Email' name='email'
						required 
						value={this.state.email}
						error={this.state.formErrors.email}
						onChange={this.handleUserInput.bind(this, 'email')}/>
				</div>
			</div>
			<div className={styles.authPannelActions}>
				<Button primary disabled={!this.state.formValid}
					onClick={this.submit}>
					Ok
				</Button>
				<Link to="/">
					<Button>Cancel</Button>
				</Link>
			</div>
		</div>
	}
}

export default ForgotPassword;