import React from 'react';
import PropTypes from 'prop-types';
import styles from './toolbar.css';
import { IconButton } from 'react-toolbox/lib/button';
import Transition from 'react-transition-group/Transition';

const Toolbar = props => {
    const toolbarHeight = 80;
    let defaultWidth;
    let defaultRotation;
    let defaultLeft;
    let defaultTop;

    let X, Y, X_, Y_;

    const alpha = props.media.alpha * Math.PI / 180;

    switch (props.media.quarter) {
        case 0:
            defaultWidth = props.media.width;

            X = 0;
            Y = (props.media.height - toolbarHeight) / 2;

            X_ = X * Math.cos(alpha) + Y * Math.sin(alpha);
            Y_ = -X * Math.sin(alpha) + Y * Math.cos(alpha);

            defaultLeft = X_ + window.innerWidth / 2 - props.media.width / 2;
            defaultTop = Y_ + window.innerHeight / 2 - toolbarHeight / 2;

            defaultRotation = -props.media.alpha;
            break;
        case 1:
            defaultWidth = props.media.height;

            X = -(props.media.width - toolbarHeight) / 2;
            Y = 0;

            X_ = X * Math.cos(alpha) + Y * Math.sin(alpha);
            Y_ = -X * Math.sin(alpha) + Y * Math.cos(alpha);

            defaultLeft = X_ + window.innerWidth / 2 - props.media.height / 2;
            defaultTop = Y_ + window.innerHeight / 2 - toolbarHeight / 2;

            defaultRotation = -props.media.alpha + 90;
            break;
        case 2:
            defaultWidth = props.media.width;

            X = 0;
            Y = -(props.media.height - toolbarHeight) / 2;

            X_ = X * Math.cos(alpha) + Y * Math.sin(alpha);
            Y_ = -X * Math.sin(alpha) + Y * Math.cos(alpha);

            defaultLeft = X_ + window.innerWidth / 2 - props.media.width / 2;
            defaultTop = Y_ + window.innerHeight / 2 - toolbarHeight / 2;

            if (-180 < props.media.alpha && props.media.alpha < -135) {
                defaultRotation = -(props.media.alpha + 180);
            } else {
                defaultRotation = props.media.alpha - 180;
            }
            break;
        case 3:
            defaultWidth = props.media.height;

            X = (props.media.width - toolbarHeight) / 2;
            Y = 0;

            X_ = X * Math.cos(alpha) + Y * Math.sin(alpha);
            Y_ = -X * Math.sin(alpha) + Y * Math.cos(alpha);

            defaultLeft = X_ + window.innerWidth / 2 - props.media.height / 2;
            defaultTop = Y_ + window.innerHeight / 2 - toolbarHeight / 2;

            defaultRotation = -props.media.alpha - 90;
            break;
        default:
            break;
    }

    const basisStyle = {
        height: `${toolbarHeight}px`
    };

    const fullScreenStyle = {
        width: window.innerWidth,
        transform: 'rotate(0deg)',
        left: 0,
        top: `${window.innerHeight - toolbarHeight}px`
    };

    const defaultStyle = {
        left: `${defaultLeft}px`,
        top: `${defaultTop}px`,
        width: `${defaultWidth}px`,
        transform: `rotate(${defaultRotation}deg)`
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
        <Transition in={props.full} timeout={props.transitionDuration}>
            {state => (
                <div
                    className={styles.toolbar}
                    style={{ ...basisStyle, ...transitionStyles[state] }}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    onMouseDown={e => {
                        e.stopPropagation();
                    }}
                >
                    <div className={styles.toolbarInfos}>
                        <div>ALQOSH</div>
                        <div>2017</div>
                        <div>COLLECTION ###</div>
                    </div>
                    <div className={styles.toolbarDummySeparator} />
                    <div>
                        <IconButton
                            theme={{
                                icon: styles.toolbarButtonIcon,
                                ripple: styles.toolbarButtonRipple
                            }}
                            icon={props.full ? 'fullscreen_exit' : 'fullscreen'}
                            onClick={e => {
                                e.stopPropagation();
                                props.toggleFullScreen();
                            }}
                        />
                        <IconButton
                            theme={{
                                icon: styles.toolbarButtonIcon,
                                ripple: styles.toolbarButtonRipple
                            }}
                            icon="info_outline"
                            onClick={e => {
                                e.stopPropagation();
                                props.toggleInfosPanel();
                            }}
                        />
                    </div>
                </div>
            )}
        </Transition>
    );
};

Toolbar.propTypes = {
    full: PropTypes.bool,
    media: PropTypes.object,
    toggleFullScreen: PropTypes.func,
    toggleInfosPanel: PropTypes.func,
    transitionDuration: PropTypes.shape({
        enter: PropTypes.number,
        exit: PropTypes.number
    })
};

export default Toolbar;
