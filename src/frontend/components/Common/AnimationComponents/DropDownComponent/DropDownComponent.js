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
    children: PropTypes.object,
    className: PropTypes.string,
    display: PropTypes.bool,
    onTransitionComplete: PropTypes.func,
    transitionDuration: PropTypes.shape({
        enter: PropTypes.number,
        exit: PropTypes.number
    })
};

export default DropDownComponent;
