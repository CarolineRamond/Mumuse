import React from "react";
import PropTypes from "prop-types"

import styles from '../../Common/form.css'

class UsersEdit extends React.Component {
    render() {
        return <div className={styles.formDialogBackground}>
        	<div className={styles.formDialogContainer}>
        		EDIT
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

export default UsersEdit;
