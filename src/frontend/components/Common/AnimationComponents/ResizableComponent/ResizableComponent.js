import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import styles from './resizable.css';
import FadeInComponent from '../FadeInComponent';

const ResizableComponent = props => {
    let fullScreenRotation;
    let fullScreenWidth;
    let fullScreenHeight;
    let fullScreenTop;
    let fullScreenLeft;
    let defaultRotation;

    switch (props.dimensions.quarter) {
        case 0:
            fullScreenRotation = 0;
            fullScreenWidth = props.dimensions.parentWidth;
            fullScreenHeight = props.dimensions.parentHeight;
            fullScreenTop = 0;
            fullScreenLeft = 0;
            defaultRotation = -props.dimensions.alpha;
            break;
        case 1:
            fullScreenRotation = -90;
            fullScreenTop = (props.dimensions.parentHeight - props.dimensions.parentWidth) / 2;
            fullScreenLeft = -(props.dimensions.parentHeight - props.dimensions.parentWidth) / 2;
            fullScreenWidth = props.dimensions.parentHeight;
            fullScreenHeight = props.dimensions.parentWidth;
            defaultRotation = -props.dimensions.alpha;
            break;
        case 2:
            fullScreenRotation = 180;
            fullScreenWidth = props.dimensions.parentWidth;
            fullScreenHeight = props.dimensions.parentHeight;
            fullScreenTop = 0;
            fullScreenLeft = 0;
            if (-180 < props.dimensions.alpha && props.dimensions.alpha < -135) {
                defaultRotation = -props.dimensions.alpha;
            } else {
                defaultRotation = props.dimensions.alpha;
            }
            break;
        case 3:
            fullScreenRotation = 90;
            fullScreenTop = (props.dimensions.parentHeight - props.dimensions.parentWidth) / 2;
            fullScreenLeft = -(props.dimensions.parentHeight - props.dimensions.parentWidth) / 2;
            fullScreenWidth = props.dimensions.parentHeight;
            fullScreenHeight = props.dimensions.parentWidth;
            defaultRotation = -props.dimensions.alpha;
            break;
        default:
            break;
    }

    const fullScreenStyle = {
        transform: `rotate(${fullScreenRotation}deg)`,
        top: `${fullScreenTop}px`,
        left: `${fullScreenLeft}px`,
        width: `${fullScreenWidth}px`,
        height: `${fullScreenHeight}px`
    };

    const defaultStyle = {
        transform: `rotate(${defaultRotation}deg)`,
        top: `${parseInt(props.dimensions.top)}px`,
        left: `${parseInt(props.dimensions.left)}px`,
        width: `${parseInt(props.dimensions.width)}px`,
        height: `${parseInt(props.dimensions.height)}px`
    };

    const backdropTransitionDuration = {
        onEnter: 100,
        onLeave: 100
    };

    const transitionStyles = {
        entering: {
            ...fullScreenStyle,
            transition: `all ${props.transitionDuration.enter}ms linear`
        },
        entered: fullScreenStyle,
        exiting: {
            ...defaultStyle,
            transition: `all ${props.transitionDuration.exit}ms linear`
        },
        exited: defaultStyle
    };

    return (
        <div>
            <FadeInComponent display={props.full} transitionDuration={backdropTransitionDuration}>
                <div
                    className={styles.backdrop}
                    onClick={e => {
                        if (props.full) {
                            e.stopPropagation();
                        }
                    }}
                    onWheel={e => {
                        if (props.full) {
                            e.stopPropagation();
                        }
                    }}
                    onMouseDown={e => {
                        if (props.full) {
                            e.stopPropagation();
                        }
                    }}
                />
            </FadeInComponent>
            <Transition
                in={props.full}
                timeout={props.transitionDuration}
                onEntered={props.onTransitionComplete}
                onExited={props.onTransitionComplete}
            >
                {state => (
                    <div className={props.className} style={{ ...transitionStyles[state] }}>
                        {props.children}
                    </div>
                )}
            </Transition>
        </div>
    );
};

ResizableComponent.propTypes = {
    /** the children elements of the resizable container */
    children: PropTypes.object,

    /** the classname to apply to the resizable container */
    className: PropTypes.string,

    /** the default dimensions of the resizable container (in px)*/
    dimensions: PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        alpha: PropTypes.number,
        quarter: PropTypes.number,
        parentWidth: PropTypes.number,
        parentHeight: PropTypes.number
    }),

    /** whether the resizable container should be in full mode */
    full: PropTypes.bool,

    /** function called on fading animation complete*/
    onTransitionComplete: PropTypes.func,

    /** resize animation duration (in ms)*/
    transitionDuration: PropTypes.shape({
        /** duration of the animation default => fullscreen*/
        enter: PropTypes.number,
        /** duration of the animation fullscreen => default */
        exit: PropTypes.number
    })
};

export default ResizableComponent;
