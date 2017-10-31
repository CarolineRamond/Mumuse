import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from 'react-toolbox/lib/input';
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

import styles from '../../css/auth.css'

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			formErrors: { email: '', password: '' },
			emailValid: false,
			passwordValid: false,
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
  		let passwordValid = this.state.passwordValid;

		switch(name) {
		    case 'email':
		    	emailValid = isEmail(value);
		    	fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
		    	break;
		    case 'password':
	    		passwordValid = isLength(value, { min: 8 });
	    		fieldValidationErrors.password = passwordValid ? '': 'Password is too short';
		    	break;
		    default:
		    	break;
		}

		this.setState({
			formErrors: fieldValidationErrors,
		    emailValid: emailValid,
		    passwordValid: passwordValid
		}, this.validateForm);
	}

	validateForm() {
		this.setState({
			formValid: this.state.emailValid && this.state.passwordValid
		});
	}

	login() {
		console.log('LOGIN');
	}


 	render () {
		const url = this.props.match.url.split('/');
		const registerUrl = url.slice(0, url.length-1).concat('register').join('/');
		const forgotUrl = url.slice(0, url.length-1).concat('forgot').join('/');

		return <div className={styles.authPannel}>
			<div className={styles.authPannelTitle}>
				Login
			</div>
			<div className={styles.authPannelContent}>
				<div className={styles.authPannelForm}>

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

				</div>
				<div className={styles.authPannelLinks}>
					<Link to={registerUrl}>Create an Account</Link>
					<Link to={forgotUrl}>Forgot your password ?</Link>
				</div>
			</div>
			<div className={styles.authPannelActions}>
				<Button primary disabled={!this.state.formValid}
					onClick={this.login}>
					Login
				</Button>
				<Link to="/">
					<Button>Cancel</Button>
				</Link>
			</div>
		</div>
	}
}

export default Login;