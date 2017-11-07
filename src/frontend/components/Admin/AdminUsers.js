import React from "react";
import { connect } from "react-redux"
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { Button } from "react-toolbox/lib/button"

import { adminFetchUsers } from "../../modules/admin/admin.actions"
import { getUsers } from "../../modules/admin"
import styles from "./admin.css"

class AdminUsers extends React.Component {

	componentDidMount() {
		this.props.dispatch(adminFetchUsers());
	}

  	render() {
  		return <div className={styles.adminTabContent}>
  			<div className={styles.adminTabScrollableContent}>
  				<Table>
				    <TableHead>
				      <TableCell>Email</TableCell>
				      <TableCell>First Name</TableCell>
				      <TableCell>Last Name</TableCell>
				      <TableCell>Created</TableCell>
				      <TableCell>Email verified</TableCell>
				      <TableCell>Roles</TableCell>
				      <TableCell>Actions</TableCell>
				    </TableHead>
				    {this.props.users && this.props.users.map((user) => (
				      <TableRow key={user._id}>
				        <TableCell>{user.email}</TableCell>
				        <TableCell>{user.firstname}</TableCell>
				        <TableCell>{user.lastname}</TableCell>
				        <TableCell>{user.createdAt}</TableCell>
				        <TableCell>{user.emailVerified.toString()}</TableCell>
				        <TableCell>{user.roles.join(',')}</TableCell>
				        <TableCell>
				        	<Button primary mini floating
								className={styles.actionButton} 
								icon='edit'>
							</Button>
							<Button primary mini floating
								className={styles.actionButton} 
								icon='delete'>
							</Button>
				        </TableCell>
				      </TableRow>
				    ))}
				</Table>
			</div>
			<div className={styles.adminTabActions}>
	      		<Button className={styles.actionButton} raised primary>Add User</Button>
	      		<Button className={styles.actionButton} raised accent>Delete Users</Button>
	      	</div>
      	</div>
	}
}

const ConnectedAdminUsers = connect((store)=> {
	return {
		users: getUsers(store.admin)
	}
})(AdminUsers)

export default ConnectedAdminUsers;

