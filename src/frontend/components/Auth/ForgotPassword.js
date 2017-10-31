import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"

const ForgotPassword = ({ match })=> {
	return <div className="auth-pannel">
		<div className="auth-pannel-title">
			ForgotPassword
		</div>
		<div className="auth-pannel-content">
			<div className="auth-pannel-form">
			</div>
		</div>
		<div className="auth-pannel-actions">
			<Button color="primary">Ok</Button>
			<Link to="/">
				<Button>Cancel</Button>
			</Link>
		</div>
	</div>
}

export default ForgotPassword;