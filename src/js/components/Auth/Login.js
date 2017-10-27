import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';


const Login = ({ match })=> {
	const url = match.url.split('/');
	const registerUrl = url.slice(0, url.length-1).concat('register').join('/');
	const forgotUrl = url.slice(0, url.length-1).concat('forgot').join('/');

	return <div className="auth-pannel">
		<div className="auth-pannel-title">
			Login
		</div>
		<div className="auth-pannel-content">
			<div className="auth-pannel-form">

				<FormControl classes={{root:"auth-pannel-form-item"}}>
		          <InputLabel htmlFor="name-helper">Email</InputLabel>
		          <Input id="name-helper"/>
		          <FormHelperText>Some important helper text</FormHelperText>
		        </FormControl>

		        <FormControl>
                  <InputLabel htmlFor="pwd-helper">Password</InputLabel>
                  <Input id="pwd-helper"/>
                  <FormHelperText>Some important helper text</FormHelperText>
                </FormControl>

			</div>
			<div className="auth-pannel-links">
				<Link to={registerUrl}>Create an Account</Link>
				<Link to={forgotUrl}>Forgot your password ?</Link>
			</div>
		</div>
		<div className="auth-pannel-actions">
			<Button color="primary">Login</Button>
			<Link to="/">
				<Button>Cancel</Button>
			</Link>
		</div>
	</div>
}

export default Login;