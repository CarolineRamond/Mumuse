import React from "react";
import { Link } from "react-router-dom"

import '../../css/auth.css'

export default class Register extends React.Component {
	render() {
		return <div className="auth-background">
			<div className="auth-pannel">
				<div className="auth-pannel-title">
					Register
				</div>
				<div className="auth-pannel-content">
					<div className="auth-pannel-form">
					</div>
					<div className="auth-pannel-actions">
						<button>
							<Link to="/">Cancel</Link>
						</button>
					</div>
				</div>
			</div>
		</div>
	}
}