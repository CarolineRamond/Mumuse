import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import '../../css/auth.css'

export default class Login extends React.Component {
	render() {
		return <DialogTitle>
			<div>Login</div>
			<div>
				or <Link to="/auth/register">Create an Account</Link>
			</div>
		</DialogTitle>
	}
}