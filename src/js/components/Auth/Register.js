import React from "react";
import { Link } from "react-router-dom"
import Button from "material-ui/Button"

const Register = ({ match })=> {
	return <div className="auth-pannel">
		<div className="auth-pannel-title">
			Register
		</div>
		<div className="auth-pannel-content">
			<div className="auth-pannel-form">
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