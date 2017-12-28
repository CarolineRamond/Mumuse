import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { switchPreviewMode } = actions;

import styles from './ViewerSwitch.css';

class PreviewSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.switchPreviewMode = this.switchPreviewMode.bind(this);
    }

    switchPreviewMode() {
        this.props.dispatch(switchPreviewMode());
    }

    render() {
        return <button className={styles.previewSwitch} onClick={this.switchPreviewMode} />;
    }
}

// Props :
// * dispatch: redux store dispatch function, provided by connect (required)
PreviewSwitch.propTypes = {
    dispatch: PropTypes.func.isRequired
};

const ConnectedPreviewSwitch = connect(() => {
    return {};
})(PreviewSwitch);

export default ConnectedPreviewSwitch;
