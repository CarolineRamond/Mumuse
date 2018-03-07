import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'react-toolbox/lib/slider';
import FileInput from '../../../Common/FileInput';
import Switch from 'react-toolbox/lib/switch';
import { CompactPicker } from 'react-color';

import { actions, selectors } from '../../../../redux';
const {
    getDefaultPointColor3D,
    getPointSize3D,
    getPointWeight3D,
    shouldShowModelTexture
} = selectors;
const {
    updateDefaultPointColor3D,
    updatePointSize3D,
    updatePointWeight3D,
    toggleModelTexture,
    changeMeshUrl,
    changeTextureUrl
} = actions;

import styles from './settings-3d-panel.css';

class Settings3DPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdateDefaultPointColor = this.onUpdateDefaultPointColor.bind(this);
        this.onUpdatePointSize = this.onUpdatePointSize.bind(this);
        this.onUpdatePointWeight = this.onUpdatePointWeight.bind(this);
        this.onToggleModelTexture = this.onToggleModelTexture.bind(this);
        this.onMeshFileChange = this.onMeshFileChange.bind(this);
        this.onTextureFileChange = this.onTextureFileChange.bind(this);
        this.togglePicker = this.togglePicker.bind(this);

        this.state = {
            displayPicker: false
        };
    }

    onUpdateDefaultPointColor(color) {
        this.props.dispatch(updateDefaultPointColor3D(color.hex));
    }

    onUpdatePointSize(pointSize) {
        this.props.dispatch(updatePointSize3D(pointSize));
    }

    onUpdatePointWeight(pointWeight) {
        this.props.dispatch(updatePointWeight3D(pointWeight));
    }

    onToggleModelTexture() {
        this.props.dispatch(toggleModelTexture());
    }

    onMeshFileChange(e) {
        console.log('MESH FILE CHANGE');
        const file = e.target.files[0];
        console.log(file);
        // if (file.type.match('json.*')) {
        const url = URL.createObjectURL(file);
        this.props.dispatch(changeMeshUrl(url));
        // }
    }

    onTextureFileChange(e) {
        const file = e.target.files[0];
        if (file.type.match('image.*')) {
            const url = URL.createObjectURL(file);
            this.props.dispatch(changeTextureUrl(url));
        } else {
            console.log('BAD FILE FORMAT');
        }
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
                {/* toggle model texture */}
                <Switch
                    theme={{
                        text: styles.switchText
                    }}
                    checked={this.props.shouldShowModelTexture}
                    label="Show model texture"
                    onChange={this.onToggleModelTexture}
                />
                {/* change mesh button */}
                <FileInput onChange={this.onMeshFileChange} label="Change mesh file..." />
                {/* change texture button */}
                <FileInput onChange={this.onTextureFileChange} label="Change texture file..." />
            </div>
        );
    }
}

Settings3DPanel.propTypes = {
    defaultPointColor: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    pointSize: PropTypes.number.isRequired,
    pointWeight: PropTypes.number.isRequired,
    shouldShowModelTexture: PropTypes.bool
};

const ConnectedSettings3DPanel = connect(store => {
    return {
        defaultPointColor: getDefaultPointColor3D(store),
        pointSize: getPointSize3D(store),
        pointWeight: getPointWeight3D(store),
        shouldShowModelTexture: shouldShowModelTexture(store)
    };
})(Settings3DPanel);

export default ConnectedSettings3DPanel;
