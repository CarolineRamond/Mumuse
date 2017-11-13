import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'
import Dialog from "react-toolbox/lib/dialog"

import Form from "../../Common/Form"
import styles from '../../Common/form.css'
import { adminCreateUser } from "../../../modules/admin/admin.actions"

class UsersCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: false
        }
    }

    componentDidMount() {
        this.setState({
            active: true
        });
    }

    render() {
    	const rootUrl = '/admin/users';
    	const fields = {
    		firstname: {
    			label: "First Name",
    			type: "text",
    			required: true,
    			validate: (value)=> {
    				const isValid = (value.length > 0);
    			    const error = isValid ? '' : 'First name is required';
    			    return { isValid, error }
    			}
    		},
    		lastname: {
    			label: "Last Name",
    			type: "text",
    			required: true,
    			validate: (value)=> {
    				const isValid = (value.length > 0);
    			    const error = isValid ? '' : 'Last name is required';
    			    return { isValid, error }
    			}
    		},
    		email: {
    			label: "Email",
    			type: "email",
    			required: true,
    			validate: (value)=> {
    				const isValid = isEmail(value);
    			    const error = isValid ? '' : 'Email is invalid';
    			    return { isValid, error }
    			}
    		},
    		password: {
    			label: "Password",
    			type: "password",
    			required: true,
    			validate: (value)=> {
    		    	var errors = [];
    		    	var isValid = true;
    		    	if (!isLength(value, { min: 8 })) {
    		    		isValid = false;
    		    		errors.push(<div key="error-length"
    		    			style={{width:"250px"}}>
    		    			Password is too short
    		    			</div>);
    		    	}
    		    	if (!/\d/.test(value)) {
    		    		isValid = false;
    		    		errors.push(<div key="error-digit"
    		    			style={{width:"250px"}}>
    		    			Password should contain at least one number
    		    			</div>);
    		    	}
    		    	if (!/[a-z]/.test(value)) {
    		    		isValid = false;
    		    		errors.push(<div key="error-lc"
    		    			style={{width:"250px"}}>
    		    			Password should contain at least one lowercase character
    		    			</div>);
    		    	}
    		    	if (!/[A-Z]/.test(value)) {
    		    		isValid = false;
    		    		errors.push(<div key="error-uc"
    		    			style={{width:"250px"}}>
    		    			Password should contain at least one uppercase character
    		    			</div>);
    		    	}
    		    	if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(value)) {
    		    		isValid = false;
    		    		errors.push(<div key="error-special"
    		    			style={{width:"250px"}}>
    		    			Password should contain at least one special character (*,!,etc)
    		    			</div>);
    		    	}
    		    	var error = '';
    		    	if (errors.length > 0) {
    		    		error = <div>{errors}</div>
    		    	}
    		    	return { isValid, error }
    			}
    		},
    		confirmPassword: {
    			label: "Confirm Password",
    			type: "password",
    			required: true,
    			refValue: "password",
    			validate: (value, refValue)=> {
    				const isValid = (value === refValue);
    			    const error = isValid ? '' : 'Passwords do not match';
    			    return { isValid, error }
    			}
    		}
    	};
    	const submit = (form)=> {
    		this.props.dispatch(adminCreateUser(form));
    	}
    	const cancel = ()=> {
            this.setState({
                active: false
            });
            setTimeout(()=> {
                this.props.history.push(rootUrl);
            }, 500);
    	}

        return <Dialog title="Create User" 
            active={this.state.active}>
            <Form fields={fields}
                helper=""
                links={[]}
                cancel={cancel}
                submit={submit}
            />
        </Dialog>
    }
}

// Props :
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter
UsersCreate.propTypes = {
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object 
}

// Store connection
const ConnectedUsersCreate = connect((store)=> {
	return {}
})(UsersCreate);

export default ConnectedUsersCreate;
