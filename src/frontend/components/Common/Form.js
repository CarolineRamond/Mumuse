import React from "react";
import { Link } from "react-router-dom"
import Button from "react-toolbox/lib/button"
import Input from "react-toolbox/lib/input"
import Dropdown from "react-toolbox/lib/dropdown"
import { forIn } from "lodash"
import PropTypes from "prop-types"

import styles from './form.css'

class Form extends React.Component {

	constructor(props) {
		super(props);
		var state = {
			fieldValues: {},
			formErrors: {},
			validFields: {},
			formValid: false
		};
		forIn(this.props.fields, (field, name)=> {
			if (field.value) {
				state.fieldValues[name] = field.value;
				const validator = field.validate(field.value);
				state.formErrors[name] = validator.error;
				state.validFields[name] = validator.isValid;
			} else {
				state.fieldValues[name] = '';
				state.formErrors[name] = '';
				state.validFields[name] = false;
			}
		});
		this.state = state;
	}

	componentDidMount() {
		this.validateForm();
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
			if (field.type === "dropdown") {
				inputs.push(<Dropdown key={name}
					auto
					label={field.label}
					name={name}
					source={field.options}
					value={this.state.fieldValues[name]}
					onChange={this.handleUserInput.bind(this, name)}
					style={{width:"250px"}}/>)
			}
			else {
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
			}
		});
		var links = <div/>
		if (this.props.links) {
			links = this.props.links.map((link, i)=> {
				return <Link key={`link-${i}`} to={link.to}>
					{link.text}
				</Link>
			});
		};
		return <div className={styles.formDialog}>
			<div className={styles.formDialogContent}>
				{this.props.error &&
					<div className={styles.formDialogError}>
						{this.props.error}
					</div>
				}
				{this.props.success &&
					<div className={styles.formDialogSuccess}>
						{this.props.success}
					</div>
				}
				{!this.props.success && this.props.helper && 
					<div className={styles.formDialogHelper}>
						{this.props.helper}
					</div>
				}
				<div className={styles.formDialogForm}>
					{inputs}
				</div>
				<div className={styles.formDialogLinks}>
					{links}
				</div>
			</div>
			<div className={styles.formDialogActions}>
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

// Props :
// * title: form title (required) 
// * fields: form fields (required) 
// * submit: submit function (required)
// * cancel: cancel function (required)
// * links: other links,
// * helper: helper text
// Form.propTypes = {
//     title: PropTypes.string.isRequired, 
//     fields: PropTypes.objectOf(PropTypes.shape({
//     	label: PropTypes.string.isRequired,
//     	type: PropTypes.string.isRequired,
//     	required: PropTypes.boolean,
//     	refValue: PropTypes.string,
//     	validate: PropTypes.func.isRequired
//     })).isRequired, 
//     submit: PropTypes.func.isRequired,
//     cancel: PropTypes.func.isRequired,
//     links: PropTypes.arrayOf(PropTypes.shape({
//     	to: PropTypes.string,
//     	text: PropTypes.string
//     })),
//     helper: PropTypes.string
// }

export default Form;