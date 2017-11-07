import React from "react";
import { connect } from "react-redux"
import { Switch, Route, Redirect } from 'react-router-dom'
import {Tab, Tabs} from 'react-toolbox';

import AdminUsers from "./AdminUsers"
import styles from "./admin.css"

@connect((store)=> {
	return  {
		user: store.auth.user
	}
})
class Admin extends React.Component {
	constructor(props) {
		super(props)
		var index;
		switch (this.props.location.pathname) {
			case "/admin/users":
				index = 0;
				break;
			case "/admin/test":
				index = 1;
				break;
			default:
				index = 0;
				this.props.history.push("/admin/users");
				break;
		}
		this.state = {
			index: index
		}
        this.handleTabChange = this.handleTabChange.bind(this);
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
  		// if (this.props.user && this.props.user.roles.indexOf("admin") > -1) {
  			return <div className={styles.adminPanel}>
		  		<h1 className={styles.adminTitle}>Admin</h1>
			  	<Tabs className={styles.adminTabs}
			  		index={this.state.index}
			  		onChange={this.handleTabChange}
			  		theme={{navigationContainer: styles.adminNavigationContainer, tab: styles.adminTab}}>
				  	<Tab label='Users'>
				  		<Route exact path="/admin/users" component={AdminUsers}/>
				  	</Tab>
				  	<Tab label='Test'>
				  		<Route exact path="/admin/test" component={()=>(<div>TEST</div>)}/>
				  	</Tab>
				</Tabs>
			</div>
  	// 	} else {
			// return <Redirect to="/"/>  			
  	// 	}
	}
}

export default Admin;