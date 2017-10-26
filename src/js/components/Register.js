import React from "react";
import { Link } from "react-router-dom"
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';

import '../../css/auth.css'

export default class Register extends React.Component {
	render() {
		return <div>
			<DialogTitle>Register</DialogTitle>
			<DialogActions>
				<Link to="/">Cancel</Link>
			</DialogActions>
		</div>
	}
}