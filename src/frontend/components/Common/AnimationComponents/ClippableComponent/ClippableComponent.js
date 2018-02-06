import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import FadeInComponent from '../FadeInComponent';
import Slider from './Slider';

class ClippableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleClip = this.handleClip.bind(this);
        this.handleOpacityChange = this.handleOpacityChange.bind(this);
        this.onTransitionComplete = this.onTransitionComplete.bind(this);

        this.state = {
            imgOpacity: 1,
            imgClip: 0,
            transitionCompleted: true
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clipped !== this.props.clipped) {
            this.setState({
                transitionCompleted: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clipped !== this.props.clipped) {
            // if component is in initial state (ie if user did not clip the component)
            // dont make transition
            if (this.state.imgOpacity === 1 && this.state.imgClip === 0) {
                this.onTransitionComplete();
                return;
            }

            // else : a transition is needed
            // set transitionCompleted to false
            this.setState({
                transitionCompleted: false
            });
        }
    }

    onTransitionComplete() {
        this.setState({
            transitionCompleted: true
        });
        this.props.onTransitionComplete();
    }

    handleClip(value) {
        this.setState({
            imgClip: value
        });
    }

    handleOpacityChange(value) {
        this.setState({
            imgOpacity: value
        });
    }

    render() {
        // define image clip style according to the quarter where alpha belongs.
        // quarter 0 ("normal way") : clipping is applied to the "left" property
        // quarter 1 : clipping is applied to the "top" property
        // quarter 2 : clipping is applied to the "right" property
        // quarter 3 : clipping is applied to the "bottom" property
        let imgClipTop;
        let imgClipRight;
        let imgClipBottom;
        let imgClipLeft;
        let defaultClip;

        switch (this.props.dimensions.quarter) {
            case 0: {
                imgClipTop = 0;
                imgClipRight = this.props.dimensions.width;
                imgClipBottom = this.props.dimensions.height;
                imgClipLeft = this.state.imgClip / 100 * this.props.dimensions.width;
                defaultClip = `rect(${-window.innerHeight}px, ${window.innerWidth}px, ${
                    window.innerHeight
                }px, ${-window.innerWidth}px)`;
                break;
            }
            case 1: {
                imgClipTop = this.state.imgClip / 100 * this.props.dimensions.height;
                imgClipRight = this.props.dimensions.width;
                imgClipBottom = this.props.dimensions.height;
                imgClipLeft = 0;
                defaultClip = `rect(${-window.innerWidth}px, ${window.innerHeight}px, ${
                    window.innerWidth
                }px, ${-window.innerHeight}px)`;
                break;
            }
            case 2: {
                imgClipTop = 0;
                imgClipRight = (100 - this.state.imgClip) / 100 * this.props.dimensions.width;
                imgClipBottom = this.props.dimensions.height;
                imgClipLeft = 0;
                defaultClip = `rect(${-window.innerHeight}px, ${window.innerWidth}px, ${
                    window.innerHeight
                }px, ${-window.innerWidth}px)`;
                break;
            }
            case 3: {
                imgClipTop = 0;
                imgClipRight = this.props.dimensions.width;
                imgClipBottom = (100 - this.state.imgClip) / 100 * this.props.dimensions.height;
                imgClipLeft = 0;
                defaultClip = `rect(${-window.innerWidth}px, ${window.innerHeight}px, ${
                    window.innerWidth
                }px, ${-window.innerHeight}px)`;
                break;
            }
            default:
                break;
        }

        const basisStyle = {
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 0,
            color: 'white'
        };

        const defaultStyle = {
            opacity: 1,
            clip: defaultClip
        };

        const clippedStyle = {
            opacity: this.state.imgOpacity,
            clip: `rect(${imgClipTop}px, ${imgClipRight}px, ${imgClipBottom}px, ${imgClipLeft}px)`
        };

        const transitionStyles = {
            entering: {
                ...clippedStyle,
                transition: `all ${this.props.transitionDuration.enter}ms linear`
            },
            entered: clippedStyle,
            exiting: {
                ...defaultStyle,
                transition: `all ${this.props.transitionDuration.exit}ms linear`
            },
            exited: defaultStyle
        };

        return (
            <div>
                <Transition
                    in={this.props.clipped}
                    timeout={this.props.transitionDuration}
                    onEntered={this.onTransitionComplete}
                    onExited={this.onTransitionComplete}
                >
                    {state => (
                        <div
                            className={this.props.className}
                            style={{ ...basisStyle, ...transitionStyles[state] }}
                        >
                            {this.props.children}
                        </div>
                    )}
                </Transition>
                {/* display slider when image is clipped */}
                <FadeInComponent
                    display={this.props.clipped && this.state.transitionCompleted}
                    transitionDuration={{ onEnter: 200, onLeave: 200 }}
                >
                    <Slider
                        handleOpacityChange={this.handleOpacityChange}
                        handleClip={this.handleClip}
                        dimensions={this.props.dimensions}
                        init={{
                            imgOpacity: this.state.imgOpacity,
                            imgClip: this.state.imgClip
                        }}
                    />
                </FadeInComponent>
            </div>
        );
    }
}

ClippableComponent.propTypes = {
    children: PropTypes.object,
    className: PropTypes.string,
    clipped: PropTypes.bool,
    dimensions: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        alpha: PropTypes.number,
        quarter: PropTypes.number
    }),
    onTransitionComplete: PropTypes.func,
    transitionDuration: PropTypes.shape({
        enter: PropTypes.number,
        exit: PropTypes.number
    })
};

export default ClippableComponent;
