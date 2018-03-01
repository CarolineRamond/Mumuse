import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SplitPane from 'react-split-pane';
import { Tab, Tabs } from 'react-toolbox';

import View2D from './View2D';
import View3D from './View3D';
import PointsControlPanel from './PointsControlPanel';

import { actions } from '../../redux';
const { toggleAddMode, toggleBindMode, toggleDeleteMode, resetMode } = actions;

import styles from './main.css';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleHDragStarted = this.handleHDragStarted.bind(this);
        this.handleHDragFinished = this.handleHDragFinished.bind(this);
        this.handleVDragStarted = this.handleVDragStarted.bind(this);
        this.handleVDragFinished = this.handleVDragFinished.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.toggleTab = this.toggleTab.bind(this);

        this.state = {
            isHResizing: false,
            isVResizing: false,
            tabIndex: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
        window.addEventListener('keydown', this.handleKeydown.bind(this), false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown.bind(this), false);
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

    handleKeydown(e) {
        if (e.key === 'a') {
            this.props.dispatch(toggleAddMode());
        }
        if (e.key === 'b') {
            this.props.dispatch(toggleBindMode());
        }
        if (e.key === 'd') {
            this.props.dispatch(toggleDeleteMode());
        }
        if (e.keyCode === 27) {
            //esc
            this.props.dispatch(resetMode());
        }
    }

    toggleTab(tabIndex) {
        this.setState({
            tabIndex: tabIndex
        });
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
                defaultSize="340px"
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
                        />
                        <View2D
                            setResizeHandler={resizeHandler => {
                                this.handle2DResize = resizeHandler;
                            }}
                            setPointsChangedHandler={pointsChangeHandler => {
                                this.handle2DPointsChanged = pointsChangeHandler;
                            }}
                        />
                    </SplitPane>
                </div>
                <div className={styles.controlsPanel}>
                    <Tabs
                        index={this.state.tabIndex}
                        onChange={this.toggleTab}
                        fixed
                        theme={{
                            tabs: styles.controlsPanelTabs,
                            tab: styles.controlsPanelTabs,
                            navigationContainer: styles.controlsPanelTabsNav
                        }}
                    >
                        <Tab label="Points">
                            <PointsControlPanel />
                        </Tab>
                        <Tab label="Camera Adjustment">COUCOU CALC</Tab>
                    </Tabs>
                </div>
            </SplitPane>
        );
    }
}

Main.propTypes = {
    dispatch: PropTypes.func.isRequired
};

const ConnectedMain = connect(() => {
    return {};
})(Main);

export default ConnectedMain;
