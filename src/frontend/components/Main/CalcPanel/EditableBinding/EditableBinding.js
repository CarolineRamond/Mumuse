import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import { CompactPicker } from 'react-color';

import styles from './editable-binding.css';

class EditableBinding extends React.Component {
    constructor(props) {
        super(props);

        this.togglePicker = this.togglePicker.bind(this);
        this.updateColor = this.updateColor.bind(this);
        this.unbind = this.unbind.bind(this);

        this.state = {
            displayPicker: false
        };
    }

    togglePicker() {
        this.setState({
            displayPicker: !this.state.displayPicker
        });
    }

    updateColor(color) {
        // this.props.onUpdatePoint(this.props.point.id, { color: color.hex });
    }

    unbind() {
        // this.props.onBindPoint(this.props.point);
    }

    render() {
        return (
            <div className={styles.editableBinding}>
                {/* <div
                                   className={styles.colorButton}
                                   style={{
                                       backgroundColor: this.props.binding.color
                                   }}
                                   onClick={this.togglePicker}
                               />*/}
                <div style={{ cursor: 'default' }}>{this.props.binding.point3D.name}</div>
                <IconButton icon="link" onClick={this.unbind} />
                <div style={{ cursor: 'default' }}>{this.props.binding.point2D.name}</div>
                {/*<div
                                    className={styles.colorPicker}
                                    style={{
                                        opacity: this.state.displayPicker ? 1 : 0,
                                        zIndex: this.state.displayPicker ? 2 : 0,
                                        pointerEvents: this.state.displayPicker ? 'initial' : 'none'
                                    }}
                                >
                                    <CompactPicker
                                        color={this.props.binding.color}
                                        onChangeComplete={this.updateColor}
                                    />
                                </div>
                                <div
                                    className={styles.colorPickerBackdrop}
                                    style={{ display: this.state.displayPicker ? 'block' : 'none' }}
                                    onClick={this.togglePicker}
                                />*/}
            </div>
        );
    }
}

EditableBinding.propTypes = {
    binding: PropTypes.shape({
        point2D: PropTypes.object.isRequired,
        point3D: PropTypes.object.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired
};

export default EditableBinding;
