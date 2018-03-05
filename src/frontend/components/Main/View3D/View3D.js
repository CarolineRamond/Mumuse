import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InteractiveModel from '../../Common/InteractiveModel';
import styles from './view-3D.css';

import { actions, selectors } from '../../../redux';
const {
    get3DPoints,
    getAddMode,
    getBindMode,
    getDeleteMode,
    getDefaultPointColor,
    shouldShowModelTexture,
    shouldRedraw3DPoints
} = selectors;
const { add3DPoint, addBindingBuffer3D, update3DPoint, remove3DPoint } = actions;

class View3D extends React.Component {
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
        if (nextProps.shouldRedraw3DPoints && this.handlePointsChanged) {
            console.log('DRAW 3D POINTS, NB : ', nextProps.points.length);
            this.handlePointsChanged(nextProps.points);
        }
    }

    onAddPoint(position) {
        this.props.dispatch(add3DPoint(position));
    }

    onSelectPoint(point) {
        this.props.dispatch(addBindingBuffer3D(point));
    }

    onUpdatePoint(id, position) {
        this.props.dispatch(update3DPoint(id, position));
    }

    onRemovePoint(id) {
        this.props.dispatch(remove3DPoint(id));
    }

    handleResize() {
        if (this.handleModelResize) {
            this.handleModelResize();
        }
    }

    render() {
        return (
            <div className={styles.view3D}>
                <InteractiveModel
                    meshUrl="/public/mesh/amrit.json"
                    textureUrl="/public/textures/Amrit_002_u1_v1_8k.jpg"
                    setResizeHandler={resizeHandler => {
                        this.handleModelResize = resizeHandler;
                    }}
                    setPointsChangedHandler={pointsChangedHandler => {
                        this.handlePointsChanged = pointsChangedHandler;
                    }}
                    addMode={this.props.addMode}
                    bindMode={this.props.bindMode}
                    deleteMode={this.props.deleteMode}
                    defaultPointColor={this.props.defaultPointColor}
                    points={this.props.points}
                    onAddPoint={this.onAddPoint}
                    onSelectPoint={this.onSelectPoint}
                    onUpdatePoint={this.onUpdatePoint}
                    onRemovePoint={this.onRemovePoint}
                    shouldShowTexture={this.props.shouldShowModelTexture}
                />
            </div>
        );
    }
}

View3D.propTypes = {
    addMode: PropTypes.bool,
    bindMode: PropTypes.bool,
    defaultPointColor: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired,
    shouldRedraw3DPoints: PropTypes.bool,
    shouldShowModelTexture: PropTypes.bool
};

const ConnectedView3D = connect(store => {
    return {
        addMode: getAddMode(store),
        bindMode: getBindMode(store),
        defaultPointColor: getDefaultPointColor(store),
        deleteMode: getDeleteMode(store),
        points: get3DPoints(store),
        shouldShowModelTexture: shouldShowModelTexture(store),
        shouldRedraw3DPoints: shouldRedraw3DPoints(store)
    };
})(View3D);

export default ConnectedView3D;
