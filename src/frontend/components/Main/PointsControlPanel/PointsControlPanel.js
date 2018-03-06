import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import Switch from 'react-toolbox/lib/switch';
import EditablePoint from './EditablePoint';
import EditableBinding from './EditableBinding';

import { actions, selectors } from '../../../redux';
const {
    get2DPoints,
    get3DPoints,
    getBindings,
    getBindingBuffer2D,
    getBindingBuffer3D,
    getAddMode,
    getBindMode,
    getDeleteMode,
    getDefaultPointColor2D,
    getDefaultPointColor3D,
    shouldShowModelTexture,
    canUndo,
    canRedo
} = selectors;
const {
    update2DPoint,
    remove2DPoint,
    update3DPoint,
    remove3DPoint,
    addBindingBuffer2D,
    addBindingBuffer3D,
    addBinding,
    removeBindingBy2D,
    removeBindingBy3D,
    toggleAddMode,
    toggleBindMode,
    toggleDeleteMode,
    toggleModelTexture
} = actions;

import styles from './points-control-panel.css';

class PointsControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);

        this.onUpdate2DPoint = this.onUpdate2DPoint.bind(this);
        this.onRemove2DPoint = this.onRemove2DPoint.bind(this);
        this.onUpdate3DPoint = this.onUpdate3DPoint.bind(this);
        this.onRemove3DPoint = this.onRemove3DPoint.bind(this);

        this.onBind2DPoint = this.onBind2DPoint.bind(this);
        this.onBind3DPoint = this.onBind3DPoint.bind(this);
        this.onUnbind2DPoint = this.onUnbind2DPoint.bind(this);
        this.onUnbind3DPoint = this.onUnbind3DPoint.bind(this);

        this.onAddBinding = this.onAddBinding.bind(this);
        this.onRemoveBinding = this.onRemoveBinding.bind(this);

        this.onToggleAddMode = this.onToggleAddMode.bind(this);
        this.onToggleBindMode = this.onToggleBindMode.bind(this);
        this.onToggleDeleteMode = this.onToggleDeleteMode.bind(this);
    }

    undo() {
        this.props.dispatch(ActionCreators.undo());
    }

    redo() {
        this.props.dispatch(ActionCreators.redo());
    }

    onUpdate2DPoint(pointId, params) {
        this.props.dispatch(update2DPoint(pointId, params));
    }

    onRemove2DPoint(pointId) {
        this.props.dispatch(remove2DPoint(pointId));
    }

    onUpdate3DPoint(pointId, params) {
        this.props.dispatch(update3DPoint(pointId, params));
    }

    onRemove3DPoint(pointId) {
        this.props.dispatch(remove3DPoint(pointId));
    }

    onBind2DPoint(point) {
        this.props.dispatch(addBindingBuffer2D(point));
    }

    onBind3DPoint(point) {
        this.props.dispatch(addBindingBuffer3D(point));
    }

    onAddBinding() {
        this.props.dispatch(
            addBinding(this.props.bindingBuffer2D.id, this.props.bindingBuffer3D.id)
        );
    }

    onRemoveBinding(binding) {
        this.props.dispatch(removeBindingBy2D(binding.point2D.id));
    }

    onUnbind2DPoint(point) {
        this.props.dispatch(removeBindingBy2D(point.id));
    }

    onUnbind3DPoint(point) {
        this.props.dispatch(removeBindingBy3D(point.id));
    }

    onToggleAddMode() {
        this.props.dispatch(toggleAddMode());
    }

    onToggleBindMode() {
        this.props.dispatch(toggleBindMode());
    }

    onToggleDeleteMode() {
        this.props.dispatch(toggleDeleteMode());
    }

    render() {
        const mappedPoints2D = this.props.points2D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.onUpdate2DPoint}
                    onRemovePoint={this.onRemove2DPoint}
                    onBindPoint={this.onBind2DPoint}
                    onUnbindPoint={this.onUnbind2DPoint}
                    defaultPointColor={this.props.defaultPointColor2D}
                />
            );
        });
        const mappedBindings = this.props.bindings.map((binding, index) => {
            return (
                <EditableBinding
                    key={index}
                    binding={binding}
                    onRemoveBinding={this.onRemoveBinding}
                />
            );
        });
        const mappedPoints3D = this.props.points3D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.onUpdate3DPoint}
                    onRemovePoint={this.onRemove3DPoint}
                    onBindPoint={this.onBind3DPoint}
                    onUnbindPoint={this.onUnbind3DPoint}
                    defaultPointColor={this.props.defaultPointColor3D}
                />
            );
        });
        return (
            <div className={styles.pointsPanel}>
                <div className={styles.pointsPanelToolbar}>
                    <Switch
                        checked={this.props.addMode}
                        label="Add point (press 'a' to toggle)"
                        onChange={this.onToggleAddMode}
                    />
                    <Switch
                        checked={this.props.deleteMode}
                        label="Delete point (press 'd' to toggle)"
                        onChange={this.onToggleDeleteMode}
                    />
                    <Switch
                        checked={this.props.bindMode}
                        label="Bind 2D-3D points (press 'b' to toggle)"
                        onChange={this.onToggleBindMode}
                    />
                    <div>
                        <IconButton
                            icon="undo"
                            disabled={!this.props.canUndo}
                            onClick={this.undo}
                        />
                        <IconButton
                            icon="redo"
                            disabled={!this.props.canRedo}
                            onClick={this.redo}
                        />
                    </div>
                </div>
                <div className={styles.pointsPanelContent}>
                    <div className={styles.pointsPanelTab}>
                        3D Points
                        <div className={styles.pointsPanelTabList}>{mappedPoints3D}</div>
                    </div>
                    <div className={styles.pointsPanelTab}>
                        Bindings
                        <div className={styles.pointsPanelTabList}>{mappedBindings}</div>
                        {(this.props.bindingBuffer2D || this.props.bindingBuffer3D) && (
                            <div>
                                New Binding
                                <div className={styles.addBindingControl}>
                                    <div className={styles.addBindingPanel}>
                                        {this.props.bindingBuffer3D &&
                                            this.props.bindingBuffer3D.name}
                                    </div>
                                    <div className={styles.addBindingPanel}>
                                        {this.props.bindingBuffer2D &&
                                            this.props.bindingBuffer2D.name}
                                    </div>
                                    <IconButton
                                        icon="save"
                                        className={styles.addBindingButton}
                                        disabled={
                                            !this.props.bindingBuffer2D ||
                                            !this.props.bindingBuffer3D
                                        }
                                        onClick={this.onAddBinding}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.pointsPanelTab}>
                        2D Points
                        <div className={styles.pointsPanelTabList}>{mappedPoints2D}</div>
                    </div>
                </div>
            </div>
        );
    }
}

PointsControlPanel.propTypes = {
    addMode: PropTypes.bool,
    bindMode: PropTypes.bool,
    bindingBuffer2D: PropTypes.object,
    bindingBuffer3D: PropTypes.object,
    bindings: PropTypes.arrayOf(PropTypes.object),
    canRedo: PropTypes.bool,
    canUndo: PropTypes.bool,
    defaultPointColor2D: PropTypes.string.isRequired,
    defaultPointColor3D: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    points2D: PropTypes.arrayOf(PropTypes.object),
    points3D: PropTypes.arrayOf(PropTypes.object)
};

const ConnectedPointsControlPanel = connect(store => {
    return {
        addMode: getAddMode(store),
        bindMode: getBindMode(store),
        bindings: getBindings(store),
        bindingBuffer2D: getBindingBuffer2D(store),
        bindingBuffer3D: getBindingBuffer3D(store),
        canRedo: canRedo(store),
        canUndo: canUndo(store),
        defaultPointColor2D: getDefaultPointColor2D(store),
        defaultPointColor3D: getDefaultPointColor3D(store),
        deleteMode: getDeleteMode(store),
        points2D: get2DPoints(store),
        points3D: get3DPoints(store)
    };
})(PointsControlPanel);

export default ConnectedPointsControlPanel;
