import React from "react";
import { connect } from "react-redux"
import PropTypes from "prop-types"
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

import Form from "../../Common/Form"
import styles from '../../Common/form.css'
import { adminFetchUserById } from "../../../modules/admin/admin.actions"

class UsersEdit extends React.Component {
    
    constructor(props) {
        super(props);
        this.userId = props.match.params.userId;
    }

    componentDidMount() {
        this.props.dispatch(adminFetchUserById(this.userId));
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
            }
        };
        const links = []
        const submit = (form)=> {
            console.log('SUBMIT');
            // this.props.dispatch(adminUpdateUser(userId, form));
        }
        const cancel = ()=> {
            this.props.history.push(rootUrl);
        }
                
        return <div className={styles.formDialogBackground}>
            <div className={styles.formDialogContainer}>
                <Form title="Update User"
                    fields={fields}
                    submit={submit}
                    cancel={cancel}
                    links={links}
                    helper=""
                />
            </div>
        </div>
    }
}

// Props :
// * location : current route location, provided by function withRouter (required)
// * match : current route match, provided by function withRouter
// * history : current router history, provided by function withRouter
UsersEdit.propTypes = {
    location: PropTypes.object.isRequired, 
    match: PropTypes.object, 
    history: PropTypes.object 
}

// Store connection
const ConnectedUsersEdit = connect((store)=> {
    return {}
})(UsersEdit);

export default ConnectedUsersEdit;
