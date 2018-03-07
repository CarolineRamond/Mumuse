import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import { CompactPicker } from 'react-color';
import { Input } from 'react-toolbox/lib/input';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipIconButton = Tooltip(IconButton);

import styles from './editable-point.css';

class EditablePoint extends React.Component {
    constructor(props) {
        super(props);

        this.togglePicker = this.togglePicker.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.updateColor = this.updateColor.bind(this);
        this.updateName = this.updateName.bind(this);
        this.selectPoint = this.selectPoint.bind(this);
        this.removePoint = this.removePoint.bind(this);
        this.toggleBind = this.toggleBind.bind(this);

        this.state = {
            name: this.props.point.name,
            nameChanged: false,
            displayPicker: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.point.name
        });
    }

    togglePicker() {
        this.setState({
            displayPicker: !this.state.displayPicker
        });
    }

    onChangeName(name) {
        this.setState({
            name: name,
            nameChanged: true
        });
    }

    updateColor(color) {
        this.props.onUpdatePoint(this.props.point.id, { color: color.hex });
    }

    updateName() {
        if (this.state.name && this.state.name !== this.props.point.name) {
            this.props.onUpdatePoint(this.props.point.id, { name: this.state.name });
            this.setState({
                nameChanged: false
            });
        }
    }

    selectPoint() {
        this.props.onSelectPoint(this.props.point.id);
    }

    removePoint() {
        this.props.onRemovePoint(this.props.point.id);
    }

    toggleBind() {
        if (this.props.point.bind) {
            this.props.onUnbindPoint(this.props.point);
        } else {
            this.props.onBindPoint(this.props.point);
        }
    }

    render() {
        return (
            <div
                className={styles.editablePoint}
                style={{
                    backgroundColor: this.props.point.selected ? '#AAA' : 'white'
                }}
                onClick={e => {
                    e.stopPropagation();
                    this.selectPoint();
                }}
            >
                {/* color picker toggle */}
                <div
                    className={styles.colorButton}
                    style={{
                        backgroundColor: this.props.point.color || this.props.defaultPointColor
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        this.togglePicker();
                    }}
                />
                {/* name input */}
                <Input
                    type="text"
                    value={this.state.name}
                    onChange={this.onChangeName}
                    innerRef={el => (this.inputElement = el)}
                    theme={{
                        inputElement: styles.input,
                        bar: styles.inputBar
                    }}
                />
                <div className={styles.dummy} />
                {/* buttons */}
                <TooltipIconButton
                    tooltip={this.props.point.bind ? 'Unbind' : 'Bind'}
                    icon={this.props.point.bind ? 'sync_disabled' : 'sync'}
                    onClick={e => {
                        e.stopPropagation();
                        this.toggleBind();
                    }}
                />
                <TooltipIconButton
                    tooltip="Save"
                    icon="save"
                    onClick={e => {
                        e.stopPropagation();
                        this.updateName();
                    }}
                    disabled={!this.state.nameChanged}
                />
                <TooltipIconButton
                    tooltip="Remove"
                    icon="delete"
                    onClick={e => {
                        e.stopPropagation();
                        this.removePoint();
                    }}
                />

                {/* color picker */}
                <div
                    className={styles.colorPicker}
                    style={{
                        opacity: this.state.displayPicker ? 1 : 0,
                        zIndex: this.state.displayPicker ? 2 : 0,
                        pointerEvents: this.state.displayPicker ? 'initial' : 'none'
                    }}
                >
                    <CompactPicker
                        color={this.props.point.color}
                        onChangeComplete={this.updateColor}
                    />
                </div>
                <div
                    className={styles.colorPickerBackdrop}
                    style={{ display: this.state.displayPicker ? 'block' : 'none' }}
                    onClick={e => {
                        e.stopPropagation();
                        this.togglePicker();
                    }}
                />
            </div>
        );
    }
}

EditablePoint.propTypes = {
    defaultPointColor: PropTypes.string.isRequired,
    onBindPoint: PropTypes.func.isRequired,
    onRemovePoint: PropTypes.func.isRequired,
    onSelectPoint: PropTypes.func.isRequired,
    onUnbindPoint: PropTypes.func.isRequired,
    onUpdatePoint: PropTypes.func.isRequired,
    point: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
        bind: PropTypes.string,
        selected: PropTypes.bool
    }).isRequired
};

export default EditablePoint;
