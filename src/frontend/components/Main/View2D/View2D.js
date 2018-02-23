import React from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import PropTypes from 'prop-types';
import Switch from 'react-toolbox/lib/switch';
import { IconButton } from 'react-toolbox/lib/button';

import { actions, selectors } from '../../../redux';
const { get2DPoints } = selectors;
const { add2DPoint } = actions;

import InteractiveImage from '../../Common/InteractiveImage';
import styles from './view-2D.css';

class View2D extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.toggleAddMode = this.toggleAddMode.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.state = {
            addMode: false
        };
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
        window.addEventListener('keypress', this.handleKeypress, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeypress, false);
    }

    handleResize() {
        this.handleImageResize();
    }

    handleKeypress(e) {
        if (e.key === 'a') {
            this.toggleAddMode();
        }
    }

    toggleAddMode() {
        this.setState({
            addMode: !this.state.addMode
        });
    }

    addPoint(coords) {
        this.props.dispatch(add2DPoint(coords));
    }

    undo() {
        this.props.dispatch(ActionCreators.undo());
    }

    redo() {
        this.props.dispatch(ActionCreators.redo());
    }

    render() {
        const mappedPoints = this.props.points.map((point, index) => {
            return (
                <li key={index}>
                    x: {point.x} ; y: {point.y}
                </li>
            );
        });
        return (
            <div className={styles.view2D}>
                <div className={styles.toolbar2D}>
                    <Switch
                        theme={{
                            text: styles.lightText
                        }}
                        checked={this.state.addMode}
                        label="Add point (press 'a' to toggle)"
                        onChange={this.toggleAddMode}
                    />
                    <ul>{mappedPoints}</ul>
                    <div>
                        <IconButton icon="undo" onClick={this.undo} />
                        <IconButton icon="redo" onClick={this.redo} />
                    </div>
                </div>
                <InteractiveImage
                    interactive
                    mediaUrl="/public/img/amrit_01.jpg"
                    setResizeHandler={resizeHandler => {
                        this.handleImageResize = resizeHandler;
                    }}
                    addMode={this.state.addMode}
                    addPoint={this.addPoint}
                    points={this.props.points}
                />
            </div>
        );
    }
}

View2D.propTypes = {
    dispatch: PropTypes.func.isRequired,
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    setResizeHandler: PropTypes.func
};

const ConnectedView2D = connect(store => {
    return {
        points: get2DPoints(store)
    };
})(View2D);

export default ConnectedView2D;
