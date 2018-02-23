import React from 'react';
import PropTypes from 'prop-types';

import InteractiveImage from '../../Common/InteractiveImage';
import styles from './view-2D.css';

class View2D extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.props.setResizeHandler(this.handleResize);
    }

    handleResize() {
        this.handleImageResize();
    }

    render() {
        return (
            <div className={styles.view2D}>
                <InteractiveImage
                    interactive
                    mediaUrl="/public/img/amrit_01.jpg"
                    setResizeHandler={resizeHandler => {
                        this.handleImageResize = resizeHandler;
                    }}
                />
            </div>
        );
    }
}

View2D.propTypes = {
    setResizeHandler: PropTypes.func
};

export default View2D;
