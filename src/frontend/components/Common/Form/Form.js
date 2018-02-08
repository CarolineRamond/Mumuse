import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import Dropdown from 'react-toolbox/lib/dropdown';
import { forIn } from 'lodash';
import PropTypes from 'prop-types';

import styles from './form.css';

class Form extends React.Component {
    constructor(props) {
        super(props);
        const state = {
            fieldValues: {},
            formErrors: {},
            validFields: {},
            formValid: false,
            submitted: false
        };
        forIn(this.props.fields, (field, name) => {
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
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.validateForm();
        document.addEventListener('keypress', this.handleKeyPress);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.submitted && nextProps.error) {
            this.setState({
                submitted: false
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleKeyPress);
    }

    handleUserInput(name, value) {
        const newFieldValues = Object.assign({}, this.state.fieldValues, {
            [name]: value
        });
        this.setState(
            {
                fieldValues: newFieldValues
            },
            this.validateField(name, value)
        );
    }

    handleKeyPress(event) {
        const ENTER_KEY = 13;
        if (event.keyCode === ENTER_KEY && this.state.formValid) {
            this.submit();
        }
    }

    submit() {
        this.setState({
            submitted: true,
            error: null,
            success: null
        });
        this.props.submit(this.state.fieldValues);
    }

    validateField(name, value) {
        let isValid;
        let error;
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
        this.setState(
            {
                formErrors: newFormErrors,
                validFields: newValidFields
            },
            this.validateForm
        );
    }

    validateForm() {
        let newFormValid = true;
        forIn(this.props.fields, (field, name) => {
            newFormValid = newFormValid && this.state.validFields[name];
        });
        this.setState({
            formValid: newFormValid
        });
    }

    render() {
        const inputs = [];
        forIn(this.props.fields, (field, name) => {
            if (field.type === 'dropdown') {
                inputs.push(
                    <Dropdown
                        key={name}
                        auto
                        label={field.label}
                        name={name}
                        source={field.options}
                        value={this.state.fieldValues[name]}
                        onChange={this.handleUserInput.bind(this, name)}
                        style={{ width: '250px' }}
                    />
                );
            } else {
                inputs.push(
                    <Input
                        key={name}
                        type={field.type}
                        label={field.label}
                        name={name}
                        required={field.required}
                        value={this.state.fieldValues[name]}
                        error={this.state.formErrors[name]}
                        onChange={this.handleUserInput.bind(this, name)}
                        style={{ width: '250px' }}
                    />
                );
            }
        });
        let links = <div />;
        if (this.props.links) {
            links = this.props.links.map((link, i) => {
                return (
                    <Link key={`link-${i}`} to={link.to}>
                        {link.text}
                    </Link>
                );
            });
        }
        return (
            <div className={styles.formDialog}>
                <div className={styles.formDialogContent}>
                    {this.props.error && (
                        <div className={styles.formDialogError}>{this.props.error}</div>
                    )}
                    {this.props.success && (
                        <div className={styles.formDialogSuccess}>{this.props.success}</div>
                    )}
                    {!this.props.success &&
                        this.props.helper && (
                            <div className={styles.formDialogHelper}>{this.props.helper}</div>
                        )}
                    <div className={styles.formDialogForm}>{inputs}</div>
                    <div className={styles.formDialogLinks}>{links}</div>
                </div>
                <div className={styles.formDialogActions}>
                    <Button
                        primary
                        id="submit-button"
                        disabled={!this.state.formValid || this.state.submitted}
                        onClick={this.submit}
                    >
                        Submit
                    </Button>
                    <Button onClick={this.props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    }
}

Form.propTypes = {
    /** cancel function, inherited */
    cancel: PropTypes.func.isRequired,

    /** error string, inherited */
    error: PropTypes.string,

    /** form fields, inherited */
    fields: PropTypes.objectOf(
        PropTypes.shape({
            /** label of the field (ex : 'First Name')*/
            label: PropTypes.string.isRequired,
            /** Type of the field (ex : 'string')*/
            type: PropTypes.string.isRequired,
            /** whether field is required for form to be valid*/
            required: PropTypes.boolean,
            /** other field index that should be compared to current field (for 'confirm password' fields for example)*/
            refValue: PropTypes.string,
            /** field validation fonction, takes field as argument and returns boolean*/
            validate: PropTypes.func.isRequired
        })
    ).isRequired,

    /** helper text, inherited */
    helper: PropTypes.string,

    /** other links, inherited */
    links: PropTypes.arrayOf(
        PropTypes.shape({
            to: PropTypes.string,
            text: PropTypes.string
        })
    ),

    /** submit function, inherited */
    submit: PropTypes.func.isRequired,

    /** success string, inherited */
    success: PropTypes.string
};

export default Form;
