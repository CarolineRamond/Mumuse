import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from "react-toolbox/lib/input"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import contains from 'validator/lib/contains'

import styles from '../../css/auth.css'

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
	    		passwordValid = isLength(value, { min: 8 });
	    		fieldValidationErrors.password = passwordValid ? '': 'Password is too short';
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
		console.log('REGISTER');
	}

	render() {
		return <div className={styles.authPannel}>
			<div className={styles.authPannelTitle}>
				Register
			</div>
			<div className={styles.authPannelContent}>
				<div className={styles.authPannelForm}>

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
				<Link to="/">
					<Button>Cancel</Button>
				</Link>
			</div>
		</div>
	}
}

export default Register;