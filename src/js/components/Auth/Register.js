import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const Register = ({ match })=> {
	return <div className="auth-pannel">
		<div className="auth-pannel-title">
			Register
		</div>
		<div className="auth-pannel-content">
			<div className="auth-pannel-form">

				<FormControl classes={{root:"auth-pannel-form-item"}}>
		          <InputLabel htmlFor="firstname-helper">First Name</InputLabel>
		          <Input id="firstname-helper"/>
		          <FormHelperText>Some important helper text</FormHelperText>
		        </FormControl>

		        <FormControl classes={{root:"auth-pannel-form-item"}}>
		          <InputLabel htmlFor="lastname-helper">Last name</InputLabel>
		          <Input id="lastname-helper"/>
		          <FormHelperText>Some important helper text</FormHelperText>
		        </FormControl>

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

                <FormControl>
                  <InputLabel htmlFor="confirm-pwd-helper">Confirm Password</InputLabel>
                  <Input id="confirm-pwd-helper"/>
                  <FormHelperText>Some important helper text</FormHelperText>
                </FormControl>

			</div>
		</div>
		<div className="auth-pannel-actions">
			<Button color="primary">Register</Button>
			<Link to="/">
				<Button>Cancel</Button>
			</Link>
		</div>
	</div>
}

export default Register;