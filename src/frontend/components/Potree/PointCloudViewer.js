import React from 'react';
import PropTypes from 'prop-types';

import styles from './PointCloudViewer.css';
import Potree from '../Potree/Potree';

class PointCloudViewer extends React.Component {
    constructor(props) {
        super(props);
        const pointCloud = this.props.pointCloud;
        this.state = {
            pointCloud: pointCloud
        };
    }

    render() {
        return <Potree className={styles.previewPointCloudContainer} />;
    }
}

PointCloudViewer.propTypes = {
    pointCloud: PropTypes.object.isRequired
};

export default PointCloudViewer;
