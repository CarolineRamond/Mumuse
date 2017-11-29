import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'react-toolbox/lib/dialog';

import { actions } from '../../../modules';
const { deleteUsers } = actions;
import { selectors } from '../../../modules';
const { getDeleteUsersState } = selectors;

import styles from '../admin.css';

class UsersDelete extends React.Component {

	componentWillReceiveProps (nextProps) {
        if (nextProps.active && nextProps.serverState.data) {
            this.props.cancel();
        }
    }

    deleteUsers () {
        this.props.dispatch(deleteUsers(this.props.users));
    }

    actions = [
		{ label: 'Delete', onClick: this.deleteUsers.bind(this) },
		{ label: 'Cancel', onClick: this.props.cancel }
	];

	render () {
        let dialogContent;
        if (this.props.serverState.error) {
            dialogContent = <div>{this.props.serverState.error}</div>;
        } else {
            dialogContent = <div>Are you sure you want the selected user(s) ?</div>;
        }
        return <Dialog title='Delete User'
            active={this.props.active}
            onEscKeyDown={this.props.cancel}
            onOverlayClick={this.props.cancel}
            theme={{
                dialog: styles.formDialogContainer,
                body: styles.formDialog,
                title: styles.formDialogTitle
            }}
            actions={this.actions}>
            {dialogContent}
        </Dialog>;
	}
}

// Props :
// * active : whether dialog should be active, inherited from UsersTable (required)
// * cancel : function called to hide dialog, inherited from UsersTable (required)
// * dispatch: redux store dispatch function, provided by connect (required)
// * serverState : state of the request DELETE_USERS, provided by connect (required)
// *    pending: boolean, true if a request is on going
// *    data: contains successfully deleted ids once the request is finished
// *    error: contains an error string if users could not be deleted
// * users : array of userIds to delete, inherited from UsersTable (required)
UsersDelete.propTypes = {
    active: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    serverState: PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.arrayOf(PropTypes.string),
        error: PropTypes.string
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.string).isRequired
};

const ConnectedUsersDelete = connect((store)=> {
    return {
        serverState: getDeleteUsersState(store)
    };
})(UsersDelete);

export default ConnectedUsersDelete;
