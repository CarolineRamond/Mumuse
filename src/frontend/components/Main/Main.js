import React from 'react';
import SplitPane from 'react-split-pane';

import View2D from './View2D';
import View3D from './View3D';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleDragStarted = this.handleDragStarted.bind(this);
        this.handleDragFinished = this.handleDragFinished.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            isResizing: false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
    }

    handleDragStarted() {
        this.setState({
            isResizing: true
        });
    }

    handleDragFinished() {
        this.setState({
            isResizing: false
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

    render() {
        const resizerStyle = {
            width: '12px',
            background: 'transparent',
            borderLeft: '5px solid #ccc',
            cursor: 'ew-resize',
            zIndex: '1'
        };
        const resizerStyleHover = Object.assign({}, resizerStyle, {
            borderLeft: '5px solid blue'
        });
        return (
            <div>
                <SplitPane
                    split="vertical"
                    defaultSize="50%"
                    resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
                    onDragStarted={this.handleDragStarted}
                    onDragFinished={this.handleDragFinished}
                    onChange={this.handleResize}
                >
                    <View3D
                        setResizeHandler={resizeHandler => {
                            this.handle3DResize = resizeHandler;
                        }}
                    />
                    <View2D
                        setResizeHandler={resizeHandler => {
                            this.handle2DResize = resizeHandler;
                        }}
                    />
                </SplitPane>
            </div>
        );
    }
}

export default Main;
