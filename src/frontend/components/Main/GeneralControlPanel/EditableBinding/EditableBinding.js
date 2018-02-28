import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from 'react-toolbox/lib/button';
import FontIcon from 'react-toolbox/lib/font_icon';

import styles from './editable-binding.css';

class EditableBinding extends React.Component {
    render() {
        return (
            <div className={styles.editableBinding}>
                <div style={{ cursor: 'default' }}>{this.props.binding.point3D.name}</div>
                <FontIcon value="link" />
                <div style={{ cursor: 'default' }}>{this.props.binding.point2D.name}</div>
                <div className={styles.dummy} />
                <IconButton
                    icon="delete"
                    onClick={() => {
                        this.props.onRemoveBinding(this.props.binding);
                    }}
                />
            </div>
        );
    }
}

EditableBinding.propTypes = {
    binding: PropTypes.shape({
        point2D: PropTypes.object.isRequired,
        point3D: PropTypes.object.isRequired
    }).isRequired,
    onRemoveBinding: PropTypes.func.isRequired
};

export default EditableBinding;
