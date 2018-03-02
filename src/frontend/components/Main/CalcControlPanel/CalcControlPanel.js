import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';

import { actions, selectors } from '../../../redux';
const { getBindings } = selectors;

import styles from './calc-control-panel.css';

class CalcControlPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const mappedBindings = this.props.bindings.map((binding, index) => {
            return <div key={index}>binding</div>;
        });
        return (
            <div className={styles.calcPanel}>
                <div className={styles.calcPanelPointsControl}>
                    Select bindings
                    <div className={styles.calcPanelPointsList}>{mappedBindings}</div>
                </div>
                <Button>Launch calc</Button>
            </div>
        );
    }
}

CalcControlPanel.propTypes = {
    bindings: PropTypes.arrayOf(PropTypes.object),
    dispatch: PropTypes.func.isRequired
};

const ConnectedCalcControlPanel = connect(store => {
    return {
        bindings: getBindings(store)
    };
})(CalcControlPanel);

export default ConnectedCalcControlPanel;
