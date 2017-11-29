import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { Button } from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
const TooltipButton = Tooltip(Button);

import { actions } from '../../../modules';
const { fetchUsersList, resetDeleteState } = actions;
import { selectors } from '../../../modules';
const { getUsersListState } = selectors;

import UsersDelete from './UsersDelete';
import styles from '../admin.css';

class UsersTable extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			selected: [],
			confirmDelete: false,
			confirmDeleteUsers: []
		};
		this.handleUserSelect = this.handleUserSelect.bind(this);
		this.toggleDeleteConfirmation = this.toggleDeleteConfirmation.bind(this);
	}

	componentDidMount () {
		this.props.dispatch(fetchUsersList());
	}

	handleUserSelect (selectedIndexes) {
		const selected = selectedIndexes.map((index)=> {
			return this.props.usersListState.data[index]._id;
		});
		this.setState({ selected });
	}

	toggleDeleteConfirmation (user) {
		const confirmDeleteUsers = (user && user._id) ? [user._id] : this.state.selected;
		this.props.dispatch(resetDeleteState());
		this.setState({
			confirmDelete: !this.state.confirmDelete,
			confirmDeleteUsers: confirmDeleteUsers
		});
	}

	render () {
		if (this.props.usersListState.pending) {
			return <div>Loading...</div>;
		} else if (this.props.usersListState.error) {
			return <div>{this.props.usersListState.error}</div>;
		} else {
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
							<TableCell>&nbsp;</TableCell>
						</TableHead>
						{this.props.usersListState.data && this.props.usersListState.data.map((user) => (
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
											tooltip='Edit user'
										/>
									</Link>
									<TooltipButton primary mini floating
										className={styles.actionButton}
										icon='delete'
										tooltip='Delete user'
										onClick={()=>this.toggleDeleteConfirmation(user)}
									/>
								</TableCell>
							</TableRow>
						))}
					</Table>
				</div>
				<div className={styles.adminTabActions}>
					<Link to='/admin/users/create'>
						<Button className={styles.actionButton} raised primary>
							Add User
						</Button>
					</Link>
					<Button className={styles.actionButton} raised accent
						disabled={this.state.selected.length === 0}
						onClick={this.toggleDeleteConfirmation}>
						Delete Users
					</Button>
				</div>
				<UsersDelete active={this.state.confirmDelete}
					users={this.state.confirmDeleteUsers}
					cancel={this.toggleDeleteConfirmation}
				/>
			</div>;
		}
	}
}

// Props :
// * usersListState : state of the request FETCH_USERS_LIST, provided by connect, required
// *    pending: boolean, true if a request is on going
// *    data: contains the full list of users once the request is finished
// *    error: contains an error string if users could not be retrieved
UsersTable.propTypes = {
	dispatch: PropTypes.func.isRequired,
    usersListState: PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.arrayOf(PropTypes.object),
        error: PropTypes.string
    }).isRequired
};

const ConnectedUsersTable = connect((store)=> {
	return {
		usersListState: getUsersListState(store)
	};
})(UsersTable);

export default ConnectedUsersTable;
