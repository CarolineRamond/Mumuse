import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';

import styles from './navButtons.css';

const NavButtons = props => (
    <div className={styles.navButtonContainer}>
        <IconButton
            className={styles.navButton}
            theme={{
                icon: styles.navButtonIcon,
                ripple: styles.navButtonRipple
            }}
            icon="chevron_left"
            onClick={e => {
                e.stopPropagation();
                props.previous();
            }}
            onMouseDown={e => {
                e.stopPropagation();
            }}
        />
        <IconButton
            className={styles.navButton}
            theme={{
                icon: styles.navButtonIcon,
                ripple: styles.navButtonRipple
            }}
            icon="chevron_right"
            onClick={e => {
                e.stopPropagation();
                props.next();
            }}
            onMouseDown={e => {
                e.stopPropagation();
            }}
        />
    </div>
);

NavButtons.propTypes = {
    next: PropTypes.func,
    previous: PropTypes.func
};

export default NavButtons;
