import React from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import PropTypes from 'prop-types';

import { actions } from '../../modules';
const { resizeMap } = actions;
import { selectors } from '../../modules';
const { getMapPreviewMode } = selectors;

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

Main.propTypes = {
    /** redux store dispatch function, provided by connect */
    dispatch: PropTypes.func.isRequired,

    /** whether map is in preview mode (ie small) or not, provided by connect */
    mapPreviewMode: PropTypes.bool.isRequired
};

// Store connection (to dispatch resizeMap action)
const ConnectedMain = connect(store => {
    return {
        mapPreviewMode: getMapPreviewMode(store)
    };
})(Main);

export default ConnectedMain;
