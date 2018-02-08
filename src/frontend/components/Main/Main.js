import React from 'react';
import SplitPane from 'react-split-pane';

import AuthButton from '../Auth/AuthButton';
import MainPanel from './MainPanel';
import SidePanel from './SidePanel';

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
        if (this.handleMainPanelResize) {
            this.handleMainPanelResize();
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
                <AuthButton />
                <SplitPane
                    split="vertical"
                    defaultSize="70%"
                    minSize={750}
                    resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
                    onDragStarted={this.handleDragStarted}
                    onDragFinished={this.handleDragFinished}
                    onChange={this.handleResize}
                >
                    <MainPanel
                        setResizeHandler={resizeHandler => {
                            this.handleMainPanelResize = resizeHandler;
                        }}
                    />
                    <SidePanel />
                </SplitPane>
            </div>
        );
    }
}

export default Main;
