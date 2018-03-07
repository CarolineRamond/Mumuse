import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';
import SelectableBinding from './SelectableBinding';

import { actions, selectors } from '../../../redux';
const { selectBinding, updateBindingColor } = actions;
const { getBindings } = selectors;

import styles from './calc-control-panel.css';

class CalcControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onToggleBinding = this.onToggleBinding.bind(this);
        this.onSelectBinding = this.onSelectBinding.bind(this);
        this.onUpdateBindingColor = this.onUpdateBindingColor.bind(this);

        this.state = {
            toggled: new Array(props.bindings.length).fill(false)
        };
    }

    onToggleBinding(index) {
        const newToggled = this.state.toggled;
        newToggled[index] = !newToggled[index];
        this.setState({
            toggled: newToggled
        });
    }

    onSelectBinding(binding) {
        const pointId2D = binding && binding.point2D.id;
        const pointId3D = binding && binding.point3D.id;
        this.props.dispatch(selectBinding(pointId2D, pointId3D));
    }

    onUpdateBindingColor(binding, color) {
        const pointId2D = binding.point2D.id;
        const pointId3D = binding.point3D.id;
        this.props.dispatch(updateBindingColor(pointId2D, pointId3D, color));
    }

    render() {
        const mappedBindings = this.props.bindings.map((binding, index) => {
            return (
                <SelectableBinding
                    key={index}
                    binding={binding}
                    toggled={this.state.toggled[index]}
                    onToggleBinding={() => {
                        this.onToggleBinding(index);
                    }}
                    onSelectBinding={this.onSelectBinding}
                    onUpdateBindingColor={this.onUpdateBindingColor}
                />
            );
        });
        return (
            <div className={styles.calcPanel}>
                <div
                    className={styles.calcPanelPointsControl}
                    onClick={() => {
                        this.onSelectBinding(null);
                    }}
                >
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
