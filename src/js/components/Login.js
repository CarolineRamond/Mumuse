import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import '../../css/auth.css'

export default class Login extends React.Component {
	render() {
		return <Dialog open={true}>
			<DialogTitle>
				<div>Login</div>
				<div>
					or <Link to="/register">Create an Account</Link>
				</div>
			</DialogTitle>
			<DialogContent>

				<FormControl>
		          <InputLabel htmlFor="email">Email</InputLabel>
		          <Input id="email"/>
		        </FormControl>

		        <FormControl>
		          <InputLabel htmlFor="password">Password</InputLabel>
		          <Input
		            id="password"
		            type='password'/>
		        </FormControl>


			</DialogContent>
			<DialogActions>
				<Link to="/">
					<Button color="primary">
	              		Cancel
	            	</Button>
	            </Link>
	            <Button color="primary">
	              Login
	            </Button>
			</DialogActions>
		</Dialog>
	}
}