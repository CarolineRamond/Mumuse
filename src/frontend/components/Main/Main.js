import React from 'react';
import SplitPane from 'react-split-pane';

import CalcPanel from './CalcPanel';
import View2D from './View2D';
import View3D from './View3D';

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
        this.state = {
            isHResizing: false,
            isVResizing: false,
            addMode: false
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
    }

    toggleAddMode() {
        this.setState({
            addMode: !this.state.addMode
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
            zIndex: '1',
            width: '12px'
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
                            addMode={this.state.addMode}
                        />
                        <View2D
                            setResizeHandler={resizeHandler => {
                                this.handle2DResize = resizeHandler;
                            }}
                            addMode={this.state.addMode}
                        />
                    </SplitPane>
                </div>
                <CalcPanel addMode={this.state.addMode} toggleAddMode={this.toggleAddMode} />
            </SplitPane>
        );
    }
}

export default Main;
