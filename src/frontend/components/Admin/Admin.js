import React from "react";
import { connect } from "react-redux"
import { Switch, Route, Redirect } from 'react-router-dom'
import {Tab, Tabs} from 'react-toolbox';

import Users from "./Users"
import styles from "./admin.css"
import { fetchAuthUser } from "../../modules/auth/auth.actions"
import { getAuthUserState } from "../../modules/auth"


class Admin extends React.Component {

	constructor(props) {
		super(props)
        this.handleTabChange = this.handleTabChange.bind(this);
        this.state = ({
        	authorized: false
        });
	}

	componentDidMount() {
		this.props.dispatch(fetchAuthUser());
	}
	
	componentWillReceiveProps(nextProps) {
		if (!nextProps.authUserState.pending && 
			this.props.authUserState.pending) {
			// fetch user action is not pending anymore
			if (nextProps.authUserState.data &&
  			nextProps.authUserState.data.roles.indexOf("admin") > -1) {
				// an admin user is connected : setup tabs & location
				var index;
				if (this.props.location.pathname.indexOf('/admin/users') > -1) {
					index = 0;
				} else if (this.props.location.pathname.indexOf('/admin/test') > -1) {
					index = 1;
				} else {
					index = 0;
					this.props.history.push("/admin/users");
				}
				this.setState({
					authorized: true,
					index: index
				});
			} else {
				this.setState({
					authorized: false
				});
			}
		}
	}

	handleTabChange(index) {
		this.setState({index});
		switch (index) {
			case 0:
				this.props.history.push("/admin/users");
				break;
			case 1:
				this.props.history.push("/admin/test");
				break;
		}
	}

  	render() {
  		if (this.props.authUserState.pending) {
  			return <div>Loading...</div>
  		} else if (this.state.authorized) {
  			return <div className={styles.adminPanel}>
		  		<h1 className={styles.adminTitle}>Admin</h1>
			  	<Tabs className={styles.adminTabs}
			  		index={this.state.index}
			  		onChange={this.handleTabChange}
			  		theme={{
			  			navigationContainer: styles.adminNavigationContainer, 
			  			tab: styles.adminTab
			  		}}>
				  	<Tab label='Users'>
				  		<Route path="/admin/users" component={Users}/>
				  	</Tab>
				  	<Tab label='Test'>
				  		<Route path="/admin/test" component={()=>(<div>TEST</div>)}/>
				  	</Tab>
				</Tabs>
			</div>
  		} else {
			return <div>Forbidden</div>  			
  		}
	}
}

const ConnectedAdmin = connect((store)=> {
	return  {
		authUserState: getAuthUserState(store.auth)
	}
})(Admin);

export default ConnectedAdmin;