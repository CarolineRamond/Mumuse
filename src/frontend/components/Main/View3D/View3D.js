import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import InteractiveModel from '../../Common/InteractiveModel';
import styles from './view-3D.css';

import { actions, selectors } from '../../../redux';
const { get3DPoints, did3DPointsChange } = selectors;
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
        if (nextProps.didPointsChange && this.handlePointsChanged) {
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
        this.handleModelResize();
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
                    bindingMode={this.props.bindingMode}
                    deleteMode={this.props.deleteMode}
                    points={this.props.points}
                    onAddPoint={this.onAddPoint}
                    onSelectPoint={this.onSelectPoint}
                    onUpdatePoint={this.onUpdatePoint}
                    onRemovePoint={this.onRemovePoint}
                />
            </div>
        );
    }
}

View3D.propTypes = {
    addMode: PropTypes.bool,
    bindingMode: PropTypes.bool,
    deleteMode: PropTypes.bool,
    didPointsChange: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired
};

const ConnectedView3D = connect(store => {
    return {
        didPointsChange: did3DPointsChange(store),
        points: get3DPoints(store)
    };
})(View3D);

export default ConnectedView3D;
