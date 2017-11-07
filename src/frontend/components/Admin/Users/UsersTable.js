import React from "react";
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { Button } from "react-toolbox/lib/button"
import Tooltip from "react-toolbox/lib/tooltip"
const TooltipButton = Tooltip(Button);

import { adminFetchUsers } from "../../../modules/admin/admin.actions"
import { getUsers } from "../../../modules/admin"
import styles from "../admin.css"

class UsersTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: []
		}
		this.handleUserSelect = this.handleUserSelect.bind(this);
	}

	componentDidMount() {
		this.props.dispatch(adminFetchUsers());
	}

	handleUserSelect(selectedIndexes) {
		const selected = selectedIndexes.map((index)=> {
			return this.props.users[index]._id;
		});
		this.setState({ selected });
	}

  	render() {
  		return <div className={styles.adminTabContent}>
  			<div className={styles.adminTabScrollableContent}>
  				<Table multiSelectable onRowSelect={this.handleUserSelect}>
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
				      <TableRow key={user._id} selected={this.state.selected.indexOf(user._id) > -1}>
				        <TableCell>{user.email}</TableCell>
				        <TableCell>{user.firstname}</TableCell>
				        <TableCell>{user.lastname}</TableCell>
				        <TableCell>{user.createdAt}</TableCell>
				        <TableCell>{user.emailVerified.toString()}</TableCell>
				        <TableCell>{user.roles.join(',')}</TableCell>
				        <TableCell>
				        	<Link to={`/admin/users/edit/${user._id}`}>
					        	<TooltipButton primary mini floating
									className={styles.actionButton} 
									icon='edit'
									tooltip="Edit user">
								</TooltipButton>
							</Link>
							<TooltipButton primary mini floating
								className={styles.actionButton} 
								icon='delete'
								tooltip="Delete user">
							</TooltipButton>
				        </TableCell>
				      </TableRow>
				    ))}
				</Table>
			</div>
			<div className={styles.adminTabActions}>
				<Link to="/admin/users/create">
		      		<Button className={styles.actionButton} raised primary>
		      			Add User
		      		</Button>
	      		</Link>
	      		<Button className={styles.actionButton} raised accent
	      			disabled={this.state.selected.length === 0}>
	      			Delete Users
	      		</Button>
	      	</div>
      	</div>
	}
}

const ConnectedUsersTable = connect((store)=> {
	return {
		users: getUsers(store.admin)
	}
})(UsersTable)

export default ConnectedUsersTable;

