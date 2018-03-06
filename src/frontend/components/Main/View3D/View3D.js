import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button } from 'react-toolbox/lib/button';
import FadeInComponent from '../../Common/AnimationComponents/FadeInComponent';
import Settings3DPanel from './Settings3DPanel';
import InteractiveModel from '../../Common/InteractiveModel';
import styles from './view-3D.css';

import { actions, selectors } from '../../../redux';
const {
    get3DPoints,
    getAddMode,
    getBindMode,
    getDeleteMode,
    getDefaultPointColor3D,
    getPointSize3D,
    getPointWeight3D,
    shouldShowModelTexture,
    shouldRedraw3DPoints
} = selectors;
const { add3DPoint, addBindingBuffer3D, select3DPoint, update3DPoint, remove3DPoint } = actions;

class View3D extends React.Component {
    constructor(props) {
        super(props);

        this.handleResize = this.handleResize.bind(this);
        this.onAddPoint = this.onAddPoint.bind(this);
        this.onUpdatePoint = this.onUpdatePoint.bind(this);
        this.onSelectPoint = this.onSelectPoint.bind(this);
        this.onRemovePoint = this.onRemovePoint.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);

        this.state = {
            displaySettings: false
        };
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        this.props.setPointsChangedHandler(newPoints => {
            this.handlePointsChanged(newPoints);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shouldRedraw3DPoints && this.handlePointsChanged) {
            this.handlePointsChanged(nextProps.points);
        }
    }

    onAddPoint(position) {
        this.props.dispatch(add3DPoint(position));
    }

    onSelectPoint(point) {
        if (this.props.bindMode) {
            this.props.dispatch(addBindingBuffer3D(point));
        } else {
            const pointId = point ? point.id : null;
            this.props.dispatch(select3DPoint(pointId));
        }
    }

    onUpdatePoint(id, position) {
        this.props.dispatch(update3DPoint(id, position));
    }

    onRemovePoint(id) {
        this.props.dispatch(remove3DPoint(id));
    }

    handleResize() {
        if (this.handleModelResize) {
            this.handleModelResize();
        }
    }

    toggleSettings() {
        this.setState({
            displaySettings: !this.state.displaySettings
        });
    }

    render() {
        return (
            <div className={styles.view3D}>
                <InteractiveModel
                    // meshUrl="/public/mesh/amrit.json"
                    meshUrl="/public/mesh/suzanne.json"
                    textureUrl="/public/textures/Amrit_002_u1_v1_8k.jpg"
                    setResizeHandler={resizeHandler => {
                        this.handleModelResize = resizeHandler;
                    }}
                    setPointsChangedHandler={pointsChangedHandler => {
                        this.handlePointsChanged = pointsChangedHandler;
                    }}
                    addMode={this.props.addMode}
                    deleteMode={this.props.deleteMode}
                    defaultPointColor={this.props.defaultPointColor}
                    pointSize={this.props.pointSize}
                    pointWeight={this.props.pointWeight}
                    points={this.props.points}
                    onAddPoint={this.onAddPoint}
                    onSelectPoint={this.onSelectPoint}
                    onUpdatePoint={this.onUpdatePoint}
                    onRemovePoint={this.onRemovePoint}
                    shouldShowTexture={this.props.shouldShowModelTexture}
                />
                <Button
                    icon="settings"
                    mini
                    floating
                    className={styles.view3DSettingsButton}
                    onClick={this.toggleSettings}
                />
                <FadeInComponent
                    className={styles.view3DSettings}
                    display={this.state.displaySettings}
                    transitionDuration={{
                        enter: 200,
                        exit: 200
                    }}
                >
                    <Settings3DPanel />
                </FadeInComponent>
            </div>
        );
    }
}

View3D.propTypes = {
    addMode: PropTypes.bool,
    bindMode: PropTypes.bool,
    defaultPointColor: PropTypes.string.isRequired,
    deleteMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    pointSize: PropTypes.number.isRequired,
    pointWeight: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(PropTypes.object),
    setPointsChangedHandler: PropTypes.func.isRequired,
    setResizeHandler: PropTypes.func.isRequired,
    shouldRedraw3DPoints: PropTypes.bool,
    shouldShowModelTexture: PropTypes.bool
};

const ConnectedView3D = connect(store => {
    return {
        addMode: getAddMode(store),
        bindMode: getBindMode(store),
        defaultPointColor: getDefaultPointColor3D(store),
        deleteMode: getDeleteMode(store),
        pointSize: getPointSize3D(store),
        pointWeight: getPointWeight3D(store),
        points: get3DPoints(store),
        shouldShowModelTexture: shouldShowModelTexture(store),
        shouldRedraw3DPoints: shouldRedraw3DPoints(store)
    };
})(View3D);

export default ConnectedView3D;
