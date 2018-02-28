import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import { CompactPicker } from 'react-color';
import { Input } from 'react-toolbox/lib/input';

import styles from './editable-point.css';

class EditablePoint extends React.Component {
    constructor(props) {
        super(props);

        this.togglePicker = this.togglePicker.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.updateColor = this.updateColor.bind(this);
        this.updateName = this.updateName.bind(this);
        this.removePoint = this.removePoint.bind(this);

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

    removePoint() {
        this.props.onRemovePoint(this.props.point.id);
    }

    render() {
        return (
            <div className={styles.editablePoint}>
                <div
                    className={styles.colorButton}
                    style={{
                        backgroundColor: this.props.point.color
                    }}
                    onClick={this.togglePicker}
                />

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
                <IconButton
                    icon="save"
                    onClick={this.updateName}
                    disabled={!this.state.nameChanged}
                />
                <IconButton icon="delete" onClick={this.removePoint} />
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
                    onClick={this.togglePicker}
                />
            </div>
        );
    }
}

EditablePoint.propTypes = {
    point: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired,
    onRemovePoint: PropTypes.func.isRequired,
    onUpdatePoint: PropTypes.func.isRequired
};

export default EditablePoint;
