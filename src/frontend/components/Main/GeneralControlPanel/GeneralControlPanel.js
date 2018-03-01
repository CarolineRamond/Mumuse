import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CompactPicker } from 'react-color';

import { actions, selectors } from '../../../redux';
const { getDefaultPointColor, getDefaultPointSize } = selectors;
const { updateDefaultPointColor, updateDefaultPointSize } = actions;

import styles from './general-control-panel.css';

class GeneralControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateDefaultPointColor = this.onUpdateDefaultPointColor.bind(this);
        this.onUpdateDefaultPointSize = this.onUpdateDefaultPointSize.bind(this);
        this.togglePicker = this.togglePicker.bind(this);

        this.state = {
            displayPicker: false
        };
    }

    onUpdateDefaultPointColor(color) {
        this.props.dispatch(updateDefaultPointColor(color.hex));
    }

    onUpdateDefaultPointSize() {
        this.props.dispatch(updateDefaultPointSize());
    }

    togglePicker() {
        this.setState({
            displayPicker: !this.state.displayPicker
        });
    }

    render() {
        return (
            <div>
                {/* color picker toggle */}
                Default point color :
                <div
                    className={styles.colorButton}
                    style={{
                        backgroundColor: this.props.defaultPointColor
                    }}
                    onClick={this.togglePicker}
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
                        color={this.props.defaultPointColor}
                        onChangeComplete={this.onUpdateDefaultPointColor}
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

GeneralControlPanel.propTypes = {
    defaultPointColor: PropTypes.string.isRequired,
    defaultPointSize: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
};

const ConnectedGeneralControlPanel = connect(store => {
    return {
        defaultPointColor: getDefaultPointColor(store),
        defaultPointSize: getDefaultPointSize(store)
    };
})(GeneralControlPanel);

export default ConnectedGeneralControlPanel;
