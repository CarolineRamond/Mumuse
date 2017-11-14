import React from "react";
import { connect } from "react-redux"
import Dialog from "react-toolbox/lib/dialog"

import { deleteUsers } from "../../../modules/users/users.actions"
import { getDeleteUsersState } from "../../../modules/users"
import styles from "../admin.css"

class UsersDelete extends React.Component {

	componentWillReceiveProps() {
        if (serverState.data) {
            this.props.cancel();
        }
    }

    deleteUsers() {
        this.props.dispatch(deleteUsers(this.props.users));
    }

    actions = [
		{ label: "Delete", onClick: this.deleteUsers.bind(this) },
		{ label: "Cancel", onClick: this.props.cancel }
	]

	render() {
        var dialogContent;
        if (this.props.serverState.error) {
            dialogContent = <div>{this.props.serverState.error}</div>
        } else {
            dialogContent = <div>Are you sure you want the selected user(s) ?</div>
        }
      	return <Dialog title="Delete User" 
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
        </Dialog>
	}
}

const ConnectedUsersDelete = connect((store)=> {
    return {
        serverState: getDeleteUsersState(store.users);
    }
})(UsersDelete);

export default ConnectedUsersDelete;