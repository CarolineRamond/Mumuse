import React from 'react';
import PropTypes from 'prop-types';

import styles from './PointCloudViewer.css';
import Potree from '../Potree/Potree';

import PotreeViewer from '../Temp/PotreeViewer';

class PointCloudViewer extends React.Component {
    constructor(props) {
        super(props);
        const pointCloud = this.props.pointCloud;
        this.state = {
            pointCloud: pointCloud
        };
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        if (this.handlePotreeViewerResize) {
            this.handlePotreeViewerResize();
        }
    }

    render() {
        // return <Potree className={styles.previewPointCloudContainer} />;
        return (
            <PotreeViewer
                className={styles.previewPointCloudContainer}
                setResizeHandler={resizeHandler => {
                    this.handlePotreeViewerResize = resizeHandler;
                }}
            />
        );
    }
}

PointCloudViewer.propTypes = {
    pointCloud: PropTypes.object.isRequired
};

export default PointCloudViewer;
