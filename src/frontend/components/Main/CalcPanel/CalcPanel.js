import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import Switch from 'react-toolbox/lib/switch';
import { IconButton } from 'react-toolbox/lib/button';
import EditablePoint from './EditablePoint';
import EditableBinding from './EditableBinding';

import styles from './calc-panel.css';

class CalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);

        this.onBind2DPoint = this.onBind2DPoint.bind(this);
        this.onBind3DPoint = this.onBind3DPoint.bind(this);
        this.onAddBinding = this.onAddBinding.bind(this);

        this.state = {
            bind2D: null,
            bind3D: null
        };
    }

    undo() {
        this.props.dispatch(ActionCreators.undo());
    }

    redo() {
        this.props.dispatch(ActionCreators.redo());
    }

    onBind2DPoint(point) {
        this.setState({ bind2D: point });
    }

    onBind3DPoint(point) {
        this.setState({ bind3D: point });
    }

    onAddBinding() {
        this.props.onAddBinding(this.state.bind2D.id, this.state.bind3D.id);
        this.setState({
            bind2D: null,
            bind3D: null
        });
    }

    render() {
        const mappedPoints2D = this.props.points2D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.props.onUpdate2DPoint}
                    onRemovePoint={this.props.onRemove2DPoint}
                    onBindPoint={this.onBind2DPoint}
                />
            );
        });
        const mappedBindings = this.props.bindings.map((binding, index) => {
            return <EditableBinding key={index} binding={binding} />;
        });
        const mappedPoints3D = this.props.points3D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.props.onUpdate3DPoint}
                    onRemovePoint={this.props.onRemove3DPoint}
                    onBindPoint={this.onBind3DPoint}
                />
            );
        });
        return (
            <div className={styles.calcPanel}>
                <div className={styles.calcPanelToolbar}>
                    <Switch
                        checked={this.props.addMode}
                        label="Add point (press 'a' to toggle)"
                        onChange={this.props.toggleAddMode}
                    />
                    <Switch
                        checked={this.props.deleteMode}
                        label="Delete point (press 'd' to toggle)"
                        onChange={this.props.toggleDeleteMode}
                    />
                    <Switch
                        checked={this.props.bindingMode}
                        label="Bind 2D-3D points (press 'b' to toggle)"
                        onChange={this.props.toggleBindingMode}
                    />
                    <div>
                        <IconButton icon="undo" onClick={this.undo} />
                        <IconButton icon="redo" onClick={this.redo} />
                    </div>
                </div>
                <div className={styles.calcPanelContent}>
                    <div className={styles.calcPanelPointsControl}>
                        3D Points
                        {mappedPoints3D}
                    </div>
                    <div className={styles.calcPanelPointsControl}>
                        Bindings
                        <div className={styles.calcPanelPointsList}>{mappedBindings}</div>
                        {(this.state.bind2D || this.state.bind3D) && (
                            <div className={styles.addBindingControl}>
                                <div className={styles.addBindingPanel}>
                                    {this.state.bind3D && this.state.bind3D.name}
                                </div>
                                <div className={styles.addBindingPanel}>
                                    {this.state.bind2D && this.state.bind2D.name}
                                </div>
                                <IconButton
                                    icon="save"
                                    className={styles.addBindingButton}
                                    disabled={!this.state.bind2D || !this.state.bind3D}
                                    onClick={this.onAddBinding}
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.calcPanelPointsControl}>
                        2D Points
                        {mappedPoints2D}
                    </div>
                </div>
            </div>
        );
    }
}

CalcPanel.propTypes = {
    addMode: PropTypes.bool,
    bindingMode: PropTypes.bool,
    bindings: PropTypes.arrayOf(PropTypes.object),
    deleteMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    onRemove2DPoint: PropTypes.func.isRequired,
    onRemove3DPoint: PropTypes.func.isRequired,
    onUpdate2DPoint: PropTypes.func.isRequired,
    onUpdate3DPoint: PropTypes.func.isRequired,
    onAddBinding: PropTypes.func.isRequired,
    points2D: PropTypes.arrayOf(PropTypes.object),
    points3D: PropTypes.arrayOf(PropTypes.object),
    toggleAddMode: PropTypes.func.isRequired,
    toggleBindingMode: PropTypes.func.isRequired,
    toggleDeleteMode: PropTypes.func.isRequired
};

const ConnectedCalcPanel = connect(() => {
    return {};
})(CalcPanel);

export default ConnectedCalcPanel;
