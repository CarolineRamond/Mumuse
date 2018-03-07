import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';

import styles from './file-input.css';

class FileInput extends React.Component {
    render() {
        return (
            <div className={styles.fileInput}>
                <input
                    type="file"
                    onChange={this.props.onChange}
                    multiple={this.props.multiple}
                    ref={input => {
                        this.input = input;
                    }}
                />
                <Button
                    raised
                    onClick={() => {
                        this.input.click();
                    }}
                >
                    {this.props.label}
                </Button>
            </div>
        );
    }
}

FileInput.propTypes = {
    label: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

export default FileInput;
