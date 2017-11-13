import React from "react";
import { connect } from "react-redux"
import Dialog from "react-toolbox/lib/dialog"

import { adminDeleteUsers } from "../../../modules/admin/admin.actions"
import { getUsers } from "../../../modules/admin"
import styles from "../admin.css"

class UsersDelete extends React.Component {

	actions = [
		{ label: "Delete", onClick: this.props.toggle },
		{ label: "Cancel", onClick: this.props.toggle }
	]

	render() {
		return <Dialog active={this.props.active}
      		actions={this.actions}
      		title="Delete User">
      		Are you sure you want to delete this user ?
      	</Dialog>
	}
}

export default UsersDelete;
	