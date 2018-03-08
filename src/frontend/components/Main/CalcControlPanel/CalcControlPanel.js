import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import SelectableBinding from './SelectableBinding';

import { actions, selectors } from '../../../redux';
const { selectBinding, updateBindingColor, launchCalc } = actions;
const { getBindings, getCamera, getCalcState } = selectors;

import styles from './calc-control-panel.css';

class CalcControlPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onToggleBinding = this.onToggleBinding.bind(this);
        this.onSelectBinding = this.onSelectBinding.bind(this);
        this.onUpdateBindingColor = this.onUpdateBindingColor.bind(this);
        this.onLaunchCalc = this.onLaunchCalc.bind(this);

        this.state = {
            hasToggled: false,
            toggled: new Array(props.bindings.length).fill(false)
        };
    }

    onToggleBinding(index) {
        const newToggled = this.state.toggled;
        newToggled[index] = !newToggled[index];
        const newHasToggled = newToggled.reduce((value, item) => {
            return value || item;
        }, false);
        this.setState({
            hasToggled: newHasToggled,
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

    onLaunchCalc() {
        const bindings = [];
        this.props.bindings.map((binding, index) => {
            if (this.state.toggled[index]) {
                bindings.push(binding);
            }
        });
        this.props.dispatch(launchCalc(bindings, this.props.camera));
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
                <div className={styles.calcPanelPointsControl}>
                    <Button onClick={this.onLaunchCalc} disabled={!this.state.hasToggled}>
                        Launch calc
                    </Button>
                    {this.props.calcState.pending && (
                        <ProgressBar type="circular" mode="indeterminate" />
                    )}
                </div>
            </div>
        );
    }
}

CalcControlPanel.propTypes = {
    bindings: PropTypes.arrayOf(PropTypes.object),
    calcState: PropTypes.shape({
        pending: PropTypes.bool,
        data: PropTypes.object,
        error: PropTypes.string
    }),
    camera: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const ConnectedCalcControlPanel = connect(store => {
    return {
        bindings: getBindings(store),
        calcState: getCalcState(store),
        camera: getCamera(store)
    };
})(CalcControlPanel);

export default ConnectedCalcControlPanel;
