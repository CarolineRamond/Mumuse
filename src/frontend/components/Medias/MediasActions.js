import React from 'react';

import MediasUploader from './MediasUploader';
import MediasDeleter from './MediasDeleter';
import styles from './carousel.css';

class MediasActions extends React.Component {
    render() {
        return (
            <div className={styles.mediasActions}>
                <MediasUploader />
                <MediasDeleter />
            </div>
        );
    }
}

export default MediasActions;
