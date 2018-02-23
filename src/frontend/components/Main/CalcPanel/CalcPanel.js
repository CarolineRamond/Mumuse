import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import Switch from 'react-toolbox/lib/switch';
import { IconButton } from 'react-toolbox/lib/button';

import styles from './calc-panel.css';

class CalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        // this.state = {
        //     addMode: this.props.addMode
        // };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.addMode !== this.props.addMode) {
    //         this.setState({
    //             addMode: nextProps.addMode
    //         });
    //     }
    // }

    undo() {
        this.props.dispatch(ActionCreators.undo());
    }

    redo() {
        this.props.dispatch(ActionCreators.redo());
    }

    render() {
        // const mappedPoints = this.props.points.map((point, index) => {
        //     return (
        //         <li key={index}>
        //             x: {point.x} ; y: {point.y}
        //         </li>
        //     );
        // });
        return (
            <div className={styles.calcPanel}>
                <Switch
                    theme={{
                        text: styles.lightText
                    }}
                    checked={this.props.addMode}
                    label="Add point (press 'a' to toggle)"
                    onChange={this.props.toggleAddMode}
                />
                <div>
                    <IconButton icon="undo" onClick={this.undo} />
                    <IconButton icon="redo" onClick={this.redo} />
                </div>
            </div>
        );
    }
}

CalcPanel.propTypes = {
    addMode: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    toggleAddMode: PropTypes.func.isRequired
};

const ConnectedCalcPanel = connect(() => {
    return {};
})(CalcPanel);

export default ConnectedCalcPanel;