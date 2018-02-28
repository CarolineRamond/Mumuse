import React from 'react';
import SplitPane from 'react-split-pane';
import { Tab, Tabs } from 'react-toolbox';

import View2D from './View2D';
import View3D from './View3D';
import PointsControlPanel from './PointsControlPanel';

import styles from './main.css';

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
        this.toggleBindingMode = this.toggleBindingMode.bind(this);
        this.toggleDeleteMode = this.toggleDeleteMode.bind(this);
        this.toggleTab = this.toggleTab.bind(this);

        this.state = {
            isHResizing: false,
            isVResizing: false,
            addMode: false,
            deleteMode: false,
            bindingMode: false,
            tabIndex: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
        window.addEventListener('keypress', this.handleKeypress, false);
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
        if (e.key === 'b') {
            this.toggleBindingMode();
        }
        if (e.key === 'd') {
            this.toggleDeleteMode();
        }
    }

    toggleAddMode() {
        this.setState({
            addMode: !this.state.addMode,
            bindingMode: false,
            deleteMode: false
        });
    }

    toggleDeleteMode() {
        this.setState({
            addMode: false,
            bindingMode: false,
            deleteMode: !this.state.deleteMode
        });
    }

    toggleBindingMode() {
        this.setState({
            addMode: false,
            bindingMode: !this.state.bindingMode,
            deleteMode: false
        });
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
                            addMode={this.state.addMode}
                            bindingMode={this.state.bindingMode}
                            deleteMode={this.state.deleteMode}
                        />
                        <View2D
                            setResizeHandler={resizeHandler => {
                                this.handle2DResize = resizeHandler;
                            }}
                            setPointsChangedHandler={pointsChangeHandler => {
                                this.handle2DPointsChanged = pointsChangeHandler;
                            }}
                            addMode={this.state.addMode}
                            bindingMode={this.state.bindingMode}
                            deleteMode={this.state.deleteMode}
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
                            <PointsControlPanel
                                addMode={this.state.addMode}
                                bindingMode={this.state.bindingMode}
                                deleteMode={this.state.deleteMode}
                                toggleAddMode={this.toggleAddMode}
                                toggleDeleteMode={this.toggleDeleteMode}
                                toggleBindingMode={this.toggleBindingMode}
                            />
                        </Tab>
                        <Tab label="Camera Adjustment">COUCOU CALC</Tab>
                        <Tab label="Additional Settings">COUCOU SETTINGS</Tab>
                    </Tabs>
                </div>
            </SplitPane>
        );
    }
}

export default Main;
