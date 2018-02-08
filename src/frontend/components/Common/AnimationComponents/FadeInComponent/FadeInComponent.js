import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

const FadeInComponent = props => {
    const defaultStyle = {
        opacity: 0
    };

    const activeStyle = {
        opacity: 1
    };

    const transitionStyles = {
        entering: {
            ...activeStyle,
            transition: `all ${props.transitionDuration.enter}ms linear`
        },
        entered: activeStyle,
        exiting: {
            ...defaultStyle,
            transition: `all ${props.transitionDuration.exit}ms linear`
        },
        exited: defaultStyle
    };

    return (
        <Transition
            in={props.display}
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
    );
};

FadeInComponent.propTypes = {
    /** the children elements of the fading container */
    children: PropTypes.object,

    /** the classname to apply to the fading container */
    className: PropTypes.string,

    /** whether the fading container should be visible */
    display: PropTypes.bool,

    /** function called on fading animation complete*/
    onTransitionComplete: PropTypes.func,

    /** fading animation duration (in ms)*/
    transitionDuration: PropTypes.shape({
        /** duration of the animation hidden => visible*/
        enter: PropTypes.number,
        /** duration of the animation visible => hidden*/
        exit: PropTypes.number
    })
};

export default FadeInComponent;
