import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import { CompactPicker } from 'react-color';
import FontIcon from 'react-toolbox/lib/font_icon';
import Checkbox from 'react-toolbox/lib/checkbox';

import styles from './selectable-binding.css';

class SelectableBinding extends React.Component {
    constructor(props) {
        super(props);

        this.togglePicker = this.togglePicker.bind(this);
        this.updateColor = this.updateColor.bind(this);
        this.selectBinding = this.selectBinding.bind(this);
        this.toggleBinding = this.toggleBinding.bind(this);

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
        this.props.onUpdateBindingColor(this.props.binding, color.hex);
    }

    selectBinding() {
        this.props.onSelectBinding(this.props.binding);
    }

    toggleBinding() {
        this.props.onToggleBinding();
    }

    render() {
        return (
            <div
                className={styles.selectableBinding}
                style={{
                    backgroundColor: this.props.binding.selected ? '#AAA' : 'white'
                }}
                onClick={e => {
                    e.stopPropagation();
                    this.selectBinding();
                }}
            >
                {/* color picker toggle */}
                <IconButton
                    icon="edit"
                    style={{
                        margin: '10px',
                        backgroundColor: this.props.binding.color || 'white'
                    }}
                    onClick={e => {
                        e.stopPropagation();
                        this.togglePicker();
                    }}
                />
                <div style={{ cursor: 'default' }}>{this.props.binding.point3D.name}</div>
                <FontIcon value="link" />
                <div style={{ cursor: 'default' }}>{this.props.binding.point2D.name}</div>
                <div className={styles.dummy} />
                <input type="checkbox" checked={this.props.toggled} onClick={this.toggleBinding} />
                {/*<Checkbox checked={this.props.toggled} onChange={this.toggleBinding} />*/}
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
                        color={this.props.binding.color}
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

SelectableBinding.propTypes = {
    binding: PropTypes.shape({
        color: PropTypes.string,
        point2D: PropTypes.object.isRequired,
        point3D: PropTypes.object.isRequired,
        selected: PropTypes.bool
    }).isRequired,
    onSelectBinding: PropTypes.func.isRequired,
    onToggleBinding: PropTypes.func.isRequired,
    onUpdateBindingColor: PropTypes.func.isRequired,
    toggled: PropTypes.bool
};

export default SelectableBinding;
