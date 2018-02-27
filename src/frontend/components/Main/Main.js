import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';

import CalcPanel from './CalcPanel';
import View2D from './View2D';
import View3D from './View3D';

import { actions, selectors } from '../../redux';
const { get2DPoints, did2DPointsChange, get3DPoints, did3DPointsChange } = selectors;
const {
    add2DPoint,
    update2DPoint,
    remove2DPoint,
    add3DPoint,
    update3DPoint,
    remove3DPoint
} = actions;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleHDragStarted = this.handleHDragStarted.bind(this);
        this.handleHDragFinished = this.handleHDragFinished.bind(this);
        this.handleVDragStarted = this.handleVDragStarted.bind(this);
        this.handleVDragFinished = this.handleVDragFinished.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.toggleAddMode = this.toggleAddMode.bind(this);
        this.toggleDeleteMode = this.toggleDeleteMode.bind(this);

        this.onAdd3DPoint = this.onAdd3DPoint.bind(this);
        this.onUpdate3DPoint = this.onUpdate3DPoint.bind(this);
        this.onRemove3DPoint = this.onRemove3DPoint.bind(this);

        this.onAdd2DPoint = this.onAdd2DPoint.bind(this);
        this.onUpdate2DPoint = this.onUpdate2DPoint.bind(this);
        this.onRemove2DPoint = this.onRemove2DPoint.bind(this);

        this.state = {
            isHResizing: false,
            isVResizing: false,
            addMode: false,
            deleteMode: false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
        window.addEventListener('keypress', this.handleKeypress, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.did3DPointsChange && this.handle3DPointsChanged) {
            this.handle3DPointsChanged(nextProps.points3D);
        }
        if (nextProps.did2DPointsChange && this.handle2DPointsChanged) {
            this.handle2DPointsChanged(nextProps.points2D);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeypress, false);
    }

    handleHDragStarted() {
        this.setState({
            isHResizing: true
        });
    }

    handleHDragFinished() {
        this.setState({
            isHResizing: false
        });
    }

    handleVDragStarted() {
        this.setState({
            isVResizing: true
        });
    }

    handleVDragFinished() {
        this.setState({
            isVResizing: false
        });
    }

    handleResize() {
        if (this.handle2DResize) {
            this.handle2DResize();
        }
        if (this.handle3DResize) {
            this.handle3DResize();
        }
    }

    handleKeypress(e) {
        if (e.key === 'a') {
            this.toggleAddMode();
        }
        if (e.key === 'd') {
            this.toggleDeleteMode();
        }
    }

    toggleAddMode() {
        this.setState({
            addMode: !this.state.addMode,
            deleteMode: false
        });
    }

    toggleDeleteMode() {
        this.setState({
            addMode: false,
            deleteMode: !this.state.deleteMode
        });
    }

    onAdd3DPoint(position) {
        this.props.dispatch(add3DPoint(position));
    }

    onUpdate3DPoint(id, position) {
        this.props.dispatch(update3DPoint(id, position));
    }

    onRemove3DPoint(id) {
        this.props.dispatch(remove3DPoint(id));
    }

    onAdd2DPoint(position) {
        this.props.dispatch(add2DPoint(position));
    }

    onUpdate2DPoint(id, position) {
        this.props.dispatch(update2DPoint(id, position));
    }

    onRemove2DPoint(id) {
        this.props.dispatch(remove2DPoint(id));
    }

    render() {
        const hResizerStyle = {
            background: 'transparent',
            borderBottom: '5px solid #ccc',
            cursor: 'ns-resize',
            zIndex: '1',
            width: '100%'
        };
        const hResizerStyleHover = Object.assign({}, hResizerStyle, {
            borderBottom: '5px solid blue'
        });
        const vResizerStyle = {
            background: 'transparent',
            borderLeft: '5px solid #ccc',
            cursor: 'ew-resize',
            zIndex: '1'
        };
        const vResizerStyleHover = Object.assign({}, vResizerStyle, {
            borderLeft: '5px solid blue'
        });
        return (
            <SplitPane
                split="horizontal"
                primary="second"
                defaultSize="100px"
                resizerStyle={this.state.isHResizing ? hResizerStyleHover : hResizerStyle}
                onDragStarted={this.handleHDragStarted}
                onDragFinished={this.handleHDragFinished}
                onChange={this.handleResize}
            >
                <div>
                    <SplitPane
                        split="vertical"
                        defaultSize="50%"
                        resizerStyle={this.state.isVResizing ? vResizerStyleHover : vResizerStyle}
                        onDragStarted={this.handleVDragStarted}
                        onDragFinished={this.handleVDragFinished}
                        onChange={this.handleResize}
                    >
                        <View3D
                            setResizeHandler={resizeHandler => {
                                this.handle3DResize = resizeHandler;
                            }}
                            setPointsChangedHandler={pointsChangeHandler => {
                                this.handle3DPointsChanged = pointsChangeHandler;
                            }}
                            addMode={this.state.addMode}
                            deleteMode={this.state.deleteMode}
                            points={this.props.points3D}
                            onAddPoint={this.onAdd3DPoint}
                            onUpdatePoint={this.onUpdate3DPoint}
                            onRemovePoint={this.onRemove3DPoint}
                        />
                        <View2D
                            setResizeHandler={resizeHandler => {
                                this.handle2DResize = resizeHandler;
                            }}
                            setPointsChangedHandler={pointsChangeHandler => {
                                this.handle2DPointsChanged = pointsChangeHandler;
                            }}
                            addMode={this.state.addMode}
                            deleteMode={this.state.deleteMode}
                            points={this.props.points2D}
                            onAddPoint={this.onAdd2DPoint}
                            onUpdatePoint={this.onUpdate2DPoint}
                            onRemovePoint={this.onRemove2DPoint}
                        />
                    </SplitPane>
                </div>
                <CalcPanel
                    addMode={this.state.addMode}
                    deleteMode={this.state.deleteMode}
                    toggleAddMode={this.toggleAddMode}
                    toggleDeleteMode={this.toggleDeleteMode}
                />
            </SplitPane>
        );
    }
}

Main.propTypes = {
    did2DPointsChange: PropTypes.bool,
    did3DPointsChange: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    points2D: PropTypes.arrayOf(PropTypes.object),
    points3D: PropTypes.arrayOf(PropTypes.object)
};

const ConnectedMain = connect(store => {
    return {
        did2DPointsChange: did2DPointsChange(store),
        did3DPointsChange: did3DPointsChange(store),
        points2D: get2DPoints(store),
        points3D: get3DPoints(store)
    };
})(Main);

export default ConnectedMain;
