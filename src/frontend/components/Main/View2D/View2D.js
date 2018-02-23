import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions, selectors } from '../../../redux';
const { get2DPoints } = selectors;
const { add2DPoint } = actions;

import InteractiveImage from '../../Common/InteractiveImage';
import styles from './view-2D.css';

class View2D extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.addPoint = this.addPoint.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
    }

    handleResize() {
        this.handleImageResize();
    }

    addPoint(coords) {
        this.props.dispatch(add2DPoint(coords));
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
                    addMode={this.props.addMode}
                    addPoint={this.addPoint}
                    points={this.props.points}
                />
            </div>
        );
    }
}

View2D.propTypes = {
    addMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    setResizeHandler: PropTypes.func
};

const ConnectedView2D = connect(store => {
    return {
        points: get2DPoints(store)
    };
})(View2D);

export default ConnectedView2D;
