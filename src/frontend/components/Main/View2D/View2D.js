import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InteractiveImage from '../../Common/InteractiveImage';
import styles from './view-2D.css';

import { actions, selectors } from '../../../redux';
const {
    get2DPoints,
    did2DPointsChange,
    getAddMode,
    getBindMode,
    getDeleteMode,
    getDefaultPointColor,
    getPointSize,
    getPointWeight
} = selectors;
const { add2DPoint, addBindingBuffer2D, update2DPoint, remove2DPoint } = actions;

class View2D extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);
        this.onAddPoint = this.onAddPoint.bind(this);
        this.onUpdatePoint = this.onUpdatePoint.bind(this);
        this.onSelectPoint = this.onSelectPoint.bind(this);
        this.onRemovePoint = this.onRemovePoint.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        this.props.setPointsChangedHandler(newPoints => {
            this.handlePointsChanged(newPoints);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.didPointsChange && this.handlePointsChanged) {
            this.handlePointsChanged(nextProps.points);
        }
    }

    onAddPoint(position) {
        this.props.dispatch(add2DPoint(position));
    }

    onSelectPoint(point) {
        this.props.dispatch(addBindingBuffer2D(point));
    }

    onUpdatePoint(id, position) {
        this.props.dispatch(update2DPoint(id, position));
    }

    onRemovePoint(id) {
        this.props.dispatch(remove2DPoint(id));
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
                    bindMode={this.props.bindMode}
                    deleteMode={this.props.deleteMode}
                    points={this.props.points}
                    onAddPoint={this.onAddPoint}
                    onSelectPoint={this.onSelectPoint}
                    onUpdatePoint={this.onUpdatePoint}
                    onRemovePoint={this.onRemovePoint}
                    defaultPointColor={this.props.defaultPointColor}
                    pointSize={this.props.pointSize}
                    pointWeight={this.props.pointWeight}
                />
            </div>
        );
    }
}

View2D.propTypes = {
    addMode: PropTypes.bool,
    bindMode: PropTypes.bool,
    defaultPointColor: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    didPointsChange: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    pointSize: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    pointWeight: PropTypes.number.isRequired,
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired
};

const ConnectedView2D = connect(store => {
    return {
        addMode: getAddMode(store),
        bindMode: getBindMode(store),
        defaultPointColor: getDefaultPointColor(store),
        deleteMode: getDeleteMode(store),
        didPointsChange: did2DPointsChange(store),
        pointSize: getPointSize(store),
        points: get2DPoints(store),
        pointWeight: getPointWeight(store)
    };
})(View2D);

export default ConnectedView2D;
