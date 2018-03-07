import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'react-toolbox/lib/slider';
import FileInput from '../../../Common/FileInput';
import { CompactPicker } from 'react-color';

import { actions, selectors } from '../../../../redux';
const { getDefaultPointColor2D, getPointSize2D, getPointWeight2D } = selectors;
const { updateDefaultPointColor2D, updatePointSize2D, updatePointWeight2D } = actions;

import styles from './settings-2d-panel.css';

class Settings2DPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateDefaultPointColor = this.onUpdateDefaultPointColor.bind(this);
        this.onUpdatePointSize = this.onUpdatePointSize.bind(this);
        this.onUpdatePointWeight = this.onUpdatePointWeight.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.togglePicker = this.togglePicker.bind(this);

        this.state = {
            displayPicker: false
        };
    }

    onUpdateDefaultPointColor(color) {
        this.props.dispatch(updateDefaultPointColor2D(color.hex));
    }

    onUpdatePointSize(pointSize) {
        this.props.dispatch(updatePointSize2D(pointSize));
    }

    onUpdatePointWeight(pointWeight) {
        this.props.dispatch(updatePointWeight2D(pointWeight));
    }

    onFileChange(e) {
        console.log('IMAGE FILE CHANGED');
        // this.props.dispatch(uploadMedias(event.target.files));
    }

    togglePicker() {
        this.setState({
            displayPicker: !this.state.displayPicker
        });
    }

    render() {
        return (
            <div className={styles.pointsPanel}>
                {/* color picker toggle */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    Default point color :
                    <div
                        className={styles.colorButton}
                        style={{
                            backgroundColor: this.props.defaultPointColor
                        }}
                        onClick={this.togglePicker}
                    />
                </div>
                {/* color picker */}
                <div
                    className={styles.colorPicker}
                    style={{
                        opacity: this.state.displayPicker ? 1 : 0,
                        zIndex: this.state.displayPicker ? 201 : 0,
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
                {/* pointsize slider */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    Point size :
                    <Slider
                        theme={{
                            slider: styles.slider,
                            innerprogress: styles.sliderProgressBar
                        }}
                        value={this.props.pointSize}
                        onChange={this.onUpdatePointSize}
                        min={5}
                        step={5}
                        max={100}
                    />
                </div>
                {/* pointweight slider */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    Point weight :
                    <Slider
                        theme={{
                            slider: styles.slider,
                            innerprogress: styles.sliderProgressBar
                        }}
                        value={this.props.pointWeight}
                        onChange={this.onUpdatePointWeight}
                        min={1}
                        step={1}
                        max={20}
                    />
                </div>
                {/* change file button */}
                <FileInput onChange={this.onFileChange} label="Change image file..." />
            </div>
        );
    }
}

Settings2DPanel.propTypes = {
    defaultPointColor: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    pointSize: PropTypes.number.isRequired,
    pointWeight: PropTypes.number.isRequired
};

const ConnectedSettings2DPanel = connect(store => {
    return {
        defaultPointColor: getDefaultPointColor2D(store),
        pointSize: getPointSize2D(store),
        pointWeight: getPointWeight2D(store)
    };
})(Settings2DPanel);

export default ConnectedSettings2DPanel;
