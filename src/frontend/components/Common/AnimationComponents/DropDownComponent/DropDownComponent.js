import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

const DropDownComponent = props => {
    const defaultStyle = {
        height: 0
    };

    const activeStyle = {
        height: '100%'
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

DropDownComponent.propTypes = {
    /** the children elements of the dropdown container */
    children: PropTypes.object,

    /** the classname to apply to the dropdown container */
    className: PropTypes.string,

    /** whether the dropdown container should be visible (ie collapsed) */
    display: PropTypes.bool,

    /** function called on dropdown animation complete*/
    onTransitionComplete: PropTypes.func,

    /** dropdown animation duration (in ms)*/
    transitionDuration: PropTypes.shape({
        /** duration of the animation hidden => visible*/
        enter: PropTypes.number,
        /** duration of the animation visible => hidden*/
        exit: PropTypes.number
    })
};

export default DropDownComponent;
