import React from 'react';

import InteractiveModel from './InteractiveModel';

import styles from './main.css';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false);
        window.addEventListener('keydown', this.handleKeydown, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown, false);
    }

    handleResize() {
        if (this.handle3DResize) {
            this.handle3DResize();
        }
    }

    handleKeydown() {
        // nothing yet
    }

    render() {
        return (
            <div className={styles.main}>
                <InteractiveModel
                    setResizeHandler={resizeHandler => {
                        this.handle3DResize = resizeHandler;
                    }}
                    // meshUrl="/public/mesh/suzanne.json"
                    meshUrl="public/mesh/essai6.json"
                />
            </div>
        );
    }
}

export default Main;
