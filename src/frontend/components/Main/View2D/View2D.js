import React from 'react';
import PropTypes from 'prop-types';

import InteractiveImage from '../../Common/InteractiveImage';
import styles from './view-2D.css';

class View2D extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        this.props.setPointsChangedHandler(newPoints => {
            this.handlePointsChanged(newPoints);
        });
    }

    handleResize() {
        this.handleImageResize();
    }

    render() {
        return (
            <div className={styles.view2D}>
                <InteractiveImage
                    interactive
                    mediaUrl="/public/img/amrit_01.jpg"
                    setResizeHandler={resizeHandler => {
                        this.handleImageResize = resizeHandler;
                    }}
                    setPointsChangedHandler={pointsChangedHandler => {
                        this.handlePointsChanged = pointsChangedHandler;
                    }}
                    addMode={this.props.addMode}
                    bindingMode={this.props.bindingMode}
                    deleteMode={this.props.deleteMode}
                    points={this.props.points}
                    onAddPoint={this.props.onAddPoint}
                    onSelectPoint={this.props.onSelectPoint}
                    onUpdatePoint={this.props.onUpdatePoint}
                    onRemovePoint={this.props.onRemovePoint}
                />
            </div>
        );
    }
}

View2D.propTypes = {
    addMode: PropTypes.bool,
    bindingMode: PropTypes.bool,
    deleteMode: PropTypes.bool,
    onAddPoint: PropTypes.func.isRequired,
    onSelectPoint: PropTypes.func.isRequired,
    onRemovePoint: PropTypes.func.isRequired,
    onUpdatePoint: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired
};

export default View2D;
