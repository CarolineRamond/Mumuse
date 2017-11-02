import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from "react-toolbox/lib/input"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

import styles from '../../css/auth.css'
import { register } from '../../modules/auth/auth.actions'

@connect((store)=> {
	return {
		serverError: store.auth.registerError
	}
})

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			email: '',
			password: '',
			confirmPassword: '',
			formErrors: { 
				firstname: '',
				lastname: '',
				email: '', 
				password: '',
				confirmPassword: '' 
			},
			firstnameValid: false,
			lastnameValid: false,
			emailValid: false,
			passwordValid: false,
			confirmPasswordValid: false,
			formValid: false
		};
		this.register = this.register.bind(this);
	}

	handleUserInput(name, value) {
		this.setState({
			[name]: value
		}, this.validateField(name, value));
	}

	validateField(name, value) {
		let fieldValidationErrors = this.state.formErrors;
		let firstnameValid = this.state.firstnameValid;
		let lastnameValid = this.state.lastnameValid;
  		let emailValid = this.state.emailValid;
  		let passwordValid = this.state.passwordValid;
  		let confirmPasswordValid = this.state.confirmPasswordValid;

		switch(name) {
			case 'firstname':
		    	firstnameValid = value.length > 0;
		    	fieldValidationErrors.firstname = firstnameValid ? '' : 'Firstname is required';
		    	break;
		    case 'lastname':
		    	lastnameValid = value.length > 0;
		    	fieldValidationErrors.lastname = lastnameValid ? '' : 'Lastname is required';
		    	break;
		    case 'email':
		    	emailValid = isEmail(value);
		    	fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
		    	break;
		    case 'password':
		    	fieldValidationErrors.password = [];
		    	passwordValid = true;
		    	if (!isLength(value, { min: 8 })) {
		    		passwordValid = false;
		    		fieldValidationErrors.password.push('Password is too short');
		    	}
		    	if (!/\d/.test(value)) {
		    		passwordValid = false;
		    		fieldValidationErrors.password.push('Password should contain at least one number');
		    	}
		    	if (!/[a-z]/.test(value)) {
		    		passwordValid = false;
		    		fieldValidationErrors.password.push('Password should contain at least one lowercase character');
		    	}
		    	if (!/[A-Z]/.test(value)) {
		    		passwordValid = false;
		    		fieldValidationErrors.password.push('Password should contain at least one uppercase character');
		    	}
		    	if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) {
		    		passwordValid = false;
		    		fieldValidationErrors.password.push('Password should contain at least one special character (*,!,etc)');
		    	}
		    	break;
    	    case 'confirmPassword':
        		confirmPasswordValid = (this.state.password === value);
        		fieldValidationErrors.confirmPassword = confirmPasswordValid ? '': 'Passwords do not match';
    	    	break;
		    default:
		    	break;
		}

		this.setState({
			formErrors: fieldValidationErrors,
			firstnameValid: firstnameValid,
			lastnameValid: lastnameValid,
		    emailValid: emailValid,
		    passwordValid: passwordValid,
		    confirmPasswordValid: confirmPasswordValid
		}, this.validateForm);
	}

	validateForm() {
		this.setState({
			formValid: this.state.firstnameValid &&
				this.state.lastnameValid &&
				this.state.emailValid &&
				this.state.passwordValid &&
				this.state.confirmPasswordValid
		});
	}

	register() {
		this.props.dispatch(register({
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			password: this.state.password
		}));
	}

	render() {
		const url = this.props.match.url.split('/');
		const rootUrl = url.slice(0, url.length-2).join('/');
		var errorMessage = <div></div>;
		if (this.props.serverError) {
			errorMessage = <div className={styles.authPannelError}>
				Error : bad username or password
			</div>
		}

		return <div className={styles.authPannel}>
			<div className={styles.authPannelTitle}>
				Register
			</div>
			<div className={styles.authPannelContent}>
				<div className={styles.authPannelForm}>
					{errorMessage}
					<Input type='text' label='Firstname' name='firstname'
						required 
						value={this.state.firstname}
						error={this.state.formErrors.firstname}
						onChange={this.handleUserInput.bind(this, 'firstname')}/>

					<Input type='text' label='Lastname' name='lastname'
						required 
						value={this.state.lastname}
						error={this.state.formErrors.lastname}
						onChange={this.handleUserInput.bind(this, 'lastname')}/>

					<Input type='text' label='Email' name='email'
						required 
						value={this.state.email}
						error={this.state.formErrors.email}
						onChange={this.handleUserInput.bind(this, 'email')}/>

					<Input type='password' label='Password' name='password'
						required 
						value={this.state.password}
						error={this.state.formErrors.password}
						onChange={this.handleUserInput.bind(this, 'password')}/>

					<Input type='password' label='Confirm Password' name='confirmPassword'
						required 
						value={this.state.confirmPassword}
						error={this.state.formErrors.confirmPassword}
						onChange={this.handleUserInput.bind(this, 'confirmPassword')}/>

				</div>
			</div>
			<div className={styles.authPannelActions}>
				<Button primary disabled={!this.state.formValid}
					onClick={this.register}>
					Register
				</Button>
				<Link to={rootUrl}>
					<Button>Cancel</Button>
				</Link>
			</div>
		</div>
	}
}

export default Register;