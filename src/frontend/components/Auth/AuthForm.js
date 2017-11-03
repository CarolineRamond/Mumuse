import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from "react-toolbox/lib/input"
import { forIn } from "lodash"

import styles from '../../css/auth.css'

class AuthForm extends React.Component {

	constructor(props) {
		super(props);
		var state = {
			fieldValues: {},
			formErrors: {},
			validFields: {},
			formValid: false
		};
		forIn(this.props.fields, (field, name)=> {
			state.fieldValues[name] = '';
			state.formErrors[name] = '';
			state.validFields[name] = false;
		});
		this.state = state;
	}

	handleUserInput(name, value) {
		const newFieldValues = Object.assign({}, this.state.fieldValues, {
			[name]: value
		})
		this.setState({
			fieldValues: newFieldValues
		}, this.validateField(name, value));
	}

	validateField(name, value) {
		var isValid;
		var error;
		if (this.props.fields[name].refValue) {
			const refValue = this.state.fieldValues[this.props.fields[name].refValue];
			const validator = this.props.fields[name].validate(value, refValue);
			isValid = validator.isValid;
			error = validator.error;
		} else {
			const validator = this.props.fields[name].validate(value);
			isValid = validator.isValid;
			error = validator.error;
		}
		const newFormErrors = Object.assign({}, this.state.formErrors, {
			[name]: error
		});
		const newValidFields = Object.assign({}, this.state.validFields, {
			[name]: isValid
		});
		this.setState({
			formErrors: newFormErrors,
			validFields: newValidFields
		}, this.validateForm);
	}

	validateForm() {
		var newFormValid = true;
		forIn(this.props.fields, (field, name)=> {
			newFormValid = newFormValid && this.state.validFields[name];
		});
		this.setState({
			formValid: newFormValid
		});
	}

	render() {
		var inputs = [];
		forIn(this.props.fields, (field, name)=> {
			inputs.push(<Input key={name}
				type={field.type} 
				label={field.label} 
				name={name}
				required={field.required}
				value={this.state.fieldValues[name]}
				error={this.state.formErrors[name]}
				onChange={this.handleUserInput.bind(this, name)}
				style={{width:"250px"}}/>
			);
		});
		const links = this.props.links.map((link, i)=> {
			return <Link key={`link-${i}`} to={link.to}>
				{link.text}
			</Link>
		});
		return <div className={styles.authPannel}>
			<div className={styles.authPannelTitle}>
				{this.props.title}
			</div>
			<div className={styles.authPannelContent}>
				<div className={styles.authPannelHelper}>
					{this.props.helper}
				</div>
				<div className={styles.authPannelForm}>
					{inputs}
				</div>
				<div className={styles.authPannelLinks}>
					{links}
				</div>
			</div>
			<div className={styles.authPannelActions}>
				<Button primary disabled={!this.state.formValid}
					onClick={()=>{this.props.submit(this.state.fieldValues)}}>
					Submit
				</Button>
				<Button onClick={this.props.cancel}>
					Cancel
				</Button>
			</div>
		</div>
	}
}

export default AuthForm;