import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import Switch from 'react-toolbox/lib/switch';
import { IconButton } from 'react-toolbox/lib/button';
import EditablePoint from './EditablePoint';

import styles from './calc-panel.css';

class CalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }

    undo() {
        this.props.dispatch(ActionCreators.undo());
    }

    redo() {
        this.props.dispatch(ActionCreators.redo());
    }

    render() {
        const mappedPoints2D = this.props.points2D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.props.onUpdate2DPoint}
                    onRemovePoint={this.props.onRemove2DPoint}
                />
            );
        });
        const mappedBindings = this.props.bindings.map((binding, index) => {
            return (
                <li key={index}>
                    2D: {binding.pointId2D} ; 3D: {binding.pointId3D}
                </li>
            );
        });
        const mappedPoints3D = this.props.points3D.map((point, index) => {
            return (
                <EditablePoint
                    key={index}
                    point={point}
                    onUpdatePoint={this.props.onUpdate3DPoint}
                    onRemovePoint={this.props.onRemove3DPoint}
                />
            );
        });
        return (
            <div className={styles.calcPanel}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        flexShrink: 0
                    }}
                >
                    <Switch
                        theme={{
                            text: styles.lightText
                        }}
                        checked={this.props.addMode}
                        label="Add point (press 'a' to toggle)"
                        onChange={this.props.toggleAddMode}
                    />
                    <Switch
                        theme={{
                            text: styles.lightText
                        }}
                        checked={this.props.deleteMode}
                        label="Delete point (press 'd' to toggle)"
                        onChange={this.props.toggleDeleteMode}
                    />
                    <Switch
                        theme={{
                            text: styles.lightText
                        }}
                        checked={this.props.bindingMode}
                        label="Bind 2D-3D points (press 'b' to toggle)"
                        onChange={this.props.toggleBindingMode}
                    />
                    <div>
                        <IconButton icon="undo" onClick={this.undo} />
                        <IconButton icon="redo" onClick={this.redo} />
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        flexGrow: '1'
                    }}
                >
                    <div
                        style={{
                            width: '33.33333333%',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #666',
                            padding: '8px',
                            overflowY: 'scroll'
                        }}
                    >
                        3D Points
                        {mappedPoints3D}
                    </div>
                    <div
                        style={{
                            width: '33.33333333%',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #666a',
                            padding: '8px',
                            overflowY: 'scroll'
                        }}
                    >
                        Bindings
                        {mappedBindings}
                    </div>
                    <div
                        style={{
                            width: '33.33333333%',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #666a',
                            padding: '8px',
                            overflowY: 'scroll'
                        }}
                    >
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
