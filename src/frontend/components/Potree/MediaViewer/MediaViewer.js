import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import InteractiveImage from '../../Common/InteractiveImage';
import ResizableComponent from '../../Common/AnimationComponents/ResizableComponent';
import ClippableComponent from '../../Common/AnimationComponents/ClippableComponent';
import styles from './mediaViewer.css';

class MediaViewer extends React.Component {
    constructor(props) {
        super(props);
        this.toggleInfosPanel = this.toggleInfosPanel.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);

        this.launchFullScreenTransition = this.launchFullScreenTransition.bind(this);
        this.handleFullScreenTransitionComplete = this.handleFullScreenTransitionComplete.bind(
            this
        );
        this.handleClipTransitionComplete = this.handleClipTransitionComplete.bind(this);
        this.handleResizeTransitionComplete = this.handleResizeTransitionComplete.bind(this);
        this.toggleClip = this.toggleClip.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.fullScreenTransitionOnGoing = false;
        this.handleResize = this.handleResize.bind(this);

        this.params = {
            full: false,
            infos: false
        };
        const search = this.props.location.search;
        if (search.length !== 0) {
            const searchQueries = search.slice(1, search.length).split('&');
            searchQueries.map(query => {
                const _query = query.split('=');
                this.params[_query[0]] = _query[1];
            });
        }

        this.state = {
            full: this.params.full === 'true',
            clipped: this.params.full !== 'true',
            infos: this.params.infos === 'true'
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.media && this.props.media) {
            const didMediaDimensionsChange =
                nextProps.media.width !== this.props.media.width ||
                nextProps.media.height !== this.props.media.height ||
                nextProps.media.left !== this.props.media.left ||
                nextProps.media.top !== this.props.media.top;
            if (didMediaDimensionsChange && this.handleCanvasResize) {
                this.handleResize();
            }
        }
    }

    handleResize() {
        requestAnimationFrame(() => {
            this.handleCanvasResize();
        });
    }

    toggleInfosPanel() {
        const newDisplayInfos = !this.state.infos;
        this.setState({
            infos: newDisplayInfos
        });
    }

    handleMouseWheel(e) {
        e.stopPropagation();
        if (!this.state.fullScreenTransitionOnGoing) {
            if (e.deltaY < 0) {
                this.launchFullScreenTransition();
            } else if (this.state.full || !this.state.clipped) {
                this.shouldExit = true;
            } else {
                this.props.exit();
            }
        }
    }

    launchFullScreenTransition() {
        this.setState(
            {
                fullScreenTransitionOnGoing: true
            },
            () => {
                if (this.state.full) {
                    // image is currently in full screen : resize it
                    // once it is resized, the image will be clipped back
                    // (cf handleResizeTransitionComplete)
                    this.toggleFullScreen();
                    this.shouldToggleClip = true;
                } else {
                    // image is currently in preview mode : unclip it
                    // once it is unclipped, the image will be resized
                    // (cf handleClipTransitionComplete)
                    this.toggleClip();
                    this.shouldToggleFullScreen = true;
                }
            }
        );
    }

    handleFullScreenTransitionComplete() {
        if (this.shouldExit) {
            this.setState({
                fullScreenTransitionOnGoing: false
            });
            this.shouldExit = false;
            this.props.exit();
        } else {
            // this.updateSearch({ full: this.state.full });
            // wait a bit before making canvas interactive after transition completed
            setTimeout(() => {
                this.setState({
                    fullScreenTransitionOnGoing: false
                });
            }, 300);
        }
    }

    toggleFullScreen() {
        this.setState({
            full: !this.state.full
        });
    }

    toggleClip() {
        this.setState({
            clipped: !this.state.clipped
        });
    }

    handleClipTransitionComplete() {
        this.shouldToggleClip = false;
        if (this.shouldToggleFullScreen) {
            this.toggleFullScreen();
        } else {
            this.handleFullScreenTransitionComplete();
        }
    }

    handleResizeTransitionComplete() {
        this.shouldToggleFullScreen = false;
        if (this.shouldToggleClip) {
            this.toggleClip();
        } else {
            this.handleFullScreenTransitionComplete();
        }
    }

    render() {
        const isCanvasInteractive = this.state.full && !this.state.fullScreenTransitionOnGoing;
        const resizeTransitionDuration = {
            enter: 400,
            exit: 400
        };
        const clipTransitionDuration = {
            enter: 400,
            exit: 400
        };
        return (
            <div>
                {this.props.media && (
                    <div
                        onWheel={this.handleMouseWheel}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        onMouseUp={e => {
                            e.stopPropagation();
                        }}
                        onMouseDown={e => {
                            e.stopPropagation();
                        }}
                        onMouseMove={e => {
                            e.stopPropagation();
                        }}
                    >
                        <ResizableComponent
                            full={this.state.full}
                            className={styles.mediaViewerImg}
                            dimensions={this.props.media}
                            transitionDuration={resizeTransitionDuration}
                            onTransitionComplete={this.handleResizeTransitionComplete}
                        >
                            <ClippableComponent
                                clipped={this.state.clipped}
                                dimensions={this.props.media}
                                transitionDuration={clipTransitionDuration}
                                onTransitionComplete={this.handleClipTransitionComplete}
                            >
                                <InteractiveImage
                                    mediaUrl={this.props.media.src}
                                    quarter={this.props.media.quarter}
                                    interactive={isCanvasInteractive}
                                    resizeAnimationOnGoing={this.state.fullScreenTransitionOnGoing}
                                    handleScrollExit={this.launchFullScreenTransition}
                                    setResizeHandler={resizeHandler => {
                                        this.handleCanvasResize = resizeHandler;
                                    }}
                                />
                            </ClippableComponent>
                        </ResizableComponent>
                    </div>
                )}
            </div>
        );
    }
}

MediaViewer.propTypes = {
    dispatch: PropTypes.func,
    display: PropTypes.bool,
    exit: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    media: PropTypes.object
};

export default withRouter(MediaViewer);