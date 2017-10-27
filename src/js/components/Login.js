import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';


const Login = ({ match })=> {
	const url = match.url.split('/');
	const registerUrl = url.slice(0, url.length-1).concat('register').join('/');
	return <h3>
		<div>Login</div>
		<div>
			or <Link to={registerUrl}>Create an Account</Link>
		</div>
		<Link to="/">Cancel</Link>
	</h3>
}

export default Login;