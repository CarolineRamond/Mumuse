import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../../modules';
const { fetchUser, updateUser, resetUpdateState } = actions;
import { selectors } from '../../../modules';
const { getCurrentUserState, getUpdateUserState } = selectors;

import Form from '../../Common/Form';
import styles from '../../Common/Form/form.css';

class UsersEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false
        };
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.userId = this.props.match.params.userId;
    }

    componentDidMount() {
        this.setState({
            active: true
        });
        this.props.dispatch(fetchUser(this.userId));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateUserState.data) {
            this.cancel.bind(this)();
        }
    }

    cancel() {
        const rootUrl = '/admin/users';
        this.props.dispatch(resetUpdateState());
        this.setState({
            active: false
        });
        setTimeout(() => {
            this.props.history.push(rootUrl);
        }, 500);
    }

    submit(form) {
        this.props.dispatch(updateUser(form, this.userId));
    }

    render() {
        let dialogContent;
        if (
            this.props.currentUserState.pending ||
            (!this.props.currentUserState.data && !this.props.currentUserState.error)
        ) {
            dialogContent = <div>Loading...</div>;
        } else if (this.props.currentUserState.error) {
            dialogContent = <div>{this.props.currentUserState.error}</div>;
        } else {
            const fields = {
                firstname: {
                    label: 'First Name',
                    type: 'text',
                    value: this.props.currentUserState.data.firstname,
                    required: true,
                    validate: value => {
                        const isValid = value.length > 0;
                        const error = isValid ? '' : 'First name is required';
                        return { isValid, error };
                    }
                },
                lastname: {
                    label: 'Last Name',
                    type: 'text',
                    value: this.props.currentUserState.data.lastname,
                    required: true,
                    validate: value => {
                        const isValid = value.length > 0;
                        const error = isValid ? '' : 'Last name is required';
                        return { isValid, error };
                    }
                },
                email: {
                    label: 'Email',
                    type: 'email',
                    value: this.props.currentUserState.data.email,
                    required: true,
                    validate: value => {
                        const isValid = isEmail(value);
                        const error = isValid ? '' : 'Email is invalid';
                        return { isValid, error };
                    }
                },
                roles: {
                    label: 'Role',
                    type: 'dropdown',
                    value: this.props.currentUserState.data.roles[0],
                    options: [
                        { label: 'User', value: 'user' },
                        { label: 'Superuser', value: 'superuser' },
                        { label: 'Admin', value: 'admin' }
                    ],
                    validate: () => {
                        return { isValid: true, error: null };
                    }
                }
            };
            dialogContent = (
                <Form
                    fields={fields}
                    helper=""
                    error={this.props.updateUserState.error}
                    links={[]}
                    cancel={this.cancel}
                    submit={this.submit}
                />
            );
        }

        return (
            <Dialog
                title="Edit User"
                active={this.state.active}
                onEscKeyDown={this.cancel}
                onOverlayClick={this.cancel}
                theme={{
                    dialog: styles.formDialogContainer,
                    body: styles.formDialog,
                    title: styles.formDialogTitle
                }}
            >
                {dialogContent}
            </Dialog>
        );
    }
}

UsersEdit.propTypes = {
    /** state of the request FETCH_USER, provided by connect  */
    currentUserState: PropTypes.shape({
        /** boolean, true if a request is on going */
        pending: PropTypes.bool,
        /** contains the currently edited user once the request is finished */
        data: PropTypes.object,
        /** contains an error string if currently edited user could not be retrieved */
        error: PropTypes.string
    }).isRequired,

    /** redux store dispatch function, provided by connect  */
    dispatch: PropTypes.func.isRequired,

    /** current router history, inherited from Route component  */
    history: PropTypes.object.isRequired,

    /** current route location, inherited from Route component */
    location: PropTypes.object,

    /** current route match, inherited from Route component  */
    match: PropTypes.object.isRequired,

    /** state of the request UPDATE_USER, provided by connect  */
    updateUserState: PropTypes.shape({
        /** boolean, true if a request is on going */
        pending: PropTypes.bool,
        /** contains the newly edited user once the request is finished */
        data: PropTypes.object,
        /** contains an error string if user could not be edited */
        error: PropTypes.string
    }).isRequired
};

// Store connection
const ConnectedUsersEdit = connect(store => {
    return {
        currentUserState: getCurrentUserState(store),
        updateUserState: getUpdateUserState(store)
    };
})(UsersEdit);

export default ConnectedUsersEdit;
