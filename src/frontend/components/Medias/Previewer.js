import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import SplitPane from 'react-split-pane';

import styles from './preview.css';
import Potree from '../Potree/Potree';
import { actions } from '../../modules';
import { selectors } from '../../modules';
const { switchPreviewMode } = actions;
const { getMapPreviewMode, getSelectedMedias, getSelectedPointCloud } = selectors;
let context = null;

class ImagePreviewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.initViewer();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.media.properties._id !== this.props.media.properties._id) {
            // media did change => preload previewImg & fullImg
            this.setState({
                loading: true
            });
            const imgUrl = !this.props.previewMode
                ? nextProps.media.properties.preview_url
                : nextProps.media.properties.url;
            this.image.src = imgUrl;
        }
        if (nextProps.previewMode !== this.props.previewMode) {
            this.initViewer();
        }
    }

    initViewer() {
        this.mediaCanvas.width = this.mediaCanvas.offsetParent.clientWidth;
        this.mediaCanvas.height = this.mediaCanvas.offsetParent.clientHeight;
        this.image = new Image();
        const imgUrl = !this.props.previewMode
            ? this.props.media.properties.preview_url
            : this.props.media.properties.url;
        this.image.src = imgUrl;
        context = this.mediaCanvas.getContext('2d');
        this.trackTransforms(context);

        this.lastX = this.mediaCanvas.width / 2;
        this.lastY = this.mediaCanvas.height / 2;
        this.dragStart = null;
        this.dragged = null;
        this.scaleFactor = 1.1;

        this.image.onload = () => this.handleImageLoad();
        this.image.onerror = e => this.handleImageLoadError(e);
        this.mediaCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.mediaCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.mediaCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
        this.mediaCanvas.addEventListener('DOMMouseScroll', this.handleScroll.bind(this), false);
        this.mediaCanvas.addEventListener('mousewheel', this.handleScroll.bind(this), false);
    }

    handleImageLoad() {
        this.redraw();
        this.setState({
            loading: false
        });
    }

    handleImageLoadError(e) {
        // Use full media picture if preview is no available
        if (e.target.src === this.props.media.properties.preview_url) {
            e.target.src = this.props.media.properties.url;
        }
        this.setState({
            loading: false
        });
    }

    handleMouseDown(e) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
            'none';
        const rect = this.mediaCanvas.getBoundingClientRect();
        this.lastX = (e.clientX - rect.left) / (rect.right - rect.left) * this.mediaCanvas.width;
        this.lastY = (e.clientY - rect.top) / (rect.bottom - rect.top) * this.mediaCanvas.height;
        this.dragStart = context.transformedPoint(this.lastX, this.lastY);
        this.dragged = false;
    }

    handleMouseUp(e) {
        this.dragStart = null;
        if (!this.dragged) this.zoom(e.shiftKey ? -1 : 1);
    }

    handleMouseMove(e) {
        const rect = this.mediaCanvas.getBoundingClientRect();
        this.lastX = (e.clientX - rect.left) / (rect.right - rect.left) * this.mediaCanvas.width;
        this.lastY = (e.clientY - rect.top) / (rect.bottom - rect.top) * this.mediaCanvas.height;
        this.dragged = true;
        if (this.dragStart) {
            const pt = context.transformedPoint(this.lastX, this.lastY);
            context.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y);
            this.redraw();
        }
    }

    handleScroll(e) {
        const delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;
        if (delta) this.zoom(delta);
        return e.preventDefault() && false;
    }

    zoom(clicks) {
        const pt = context.transformedPoint(this.lastX, this.lastY);
        context.translate(pt.x, pt.y);
        const factor = Math.pow(this.scaleFactor, clicks);
        context.scale(factor, factor);
        context.translate(-pt.x, -pt.y);
        this.redraw();
    }

    redraw() {
        // Clear the entire canvas
        const p1 = context.transformedPoint(0, 0);
        const p2 = context.transformedPoint(this.mediaCanvas.width, this.mediaCanvas.height);
        context.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, this.mediaCanvas.width, this.mediaCanvas.height);
        context.restore();

        //We draw the image fitting and centering it in the canvas
        const hRatio = this.mediaCanvas.width / this.image.width;
        const vRatio = this.mediaCanvas.height / this.image.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (this.mediaCanvas.width - this.image.width * ratio) / 2;
        const centerShift_y = (this.mediaCanvas.height - this.image.height * ratio) / 2;
        context.clearRect(0, 0, this.mediaCanvas.width, this.mediaCanvas.height);
        context.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            centerShift_x,
            centerShift_y,
            this.image.width * ratio,
            this.image.height * ratio
        );

        //If we want to draw the full image without fitting and centering it in the canvas
        // context.drawImage(this.image, 0, 0);
    }

    // Adds ctx.getTransform() - returns an SVGMatrix
    // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
    trackTransforms(ctx) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let xform = svg.createSVGMatrix();
        ctx.getTransform = function() {
            return xform;
        };

        const savedTransforms = [];
        const save = ctx.save;
        ctx.save = function() {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        const restore = ctx.restore;
        ctx.restore = function() {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        const scale = ctx.scale;
        ctx.scale = function(sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        const rotate = ctx.rotate;
        ctx.rotate = function(radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        const translate = ctx.translate;
        ctx.translate = function(dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        const transform = ctx.transform;
        ctx.transform = function(a, b, c, d, e, f) {
            const m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        const setTransform = ctx.setTransform;
        ctx.setTransform = function(a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        const pt = svg.createSVGPoint();
        ctx.transformedPoint = function(x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        };
    }

    render() {
        const imgUrl = !this.props.previewMode
            ? this.props.media.properties.preview_url
            : this.props.media.properties.url;

        return (
            <div className={styles.previewImageContainer}>
                {this.state.loading && (
                    <div className={styles.previewLoaderContainer}>
                        <ProgressBar type="circular" mode="indeterminate" />
                    </div>
                )}
                <canvas
                    ref={mediaCanvas => (this.mediaCanvas = mediaCanvas)}
                    className={styles.previewImage}
                />
            </div>
        );
    }
}

ImagePreviewer.propTypes = {
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }).isRequired,
    previewMode: PropTypes.bool
};

class PointCloudPreviewer extends React.Component {
    constructor(props) {
        super(props);
        const pointCloud = this.props.pointCloud;
        this.state = {
            pointCloud: pointCloud
        };
    }

    render() {
        return <Potree className={styles.previewImageContainer} />;
    }
}

PointCloudPreviewer.propTypes = {
    pointCloud: PropTypes.object.isRequired
};

class Previewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResizing: false
        };

        this.handleDragStarted = this.handleDragStarted.bind(this);
        this.handleDragFinished = this.handleDragFinished.bind(this);
    }

    componentWillUnmount() {
        if (this.props.previewMode) {
            this.props.dispatch(switchPreviewMode());
        }
    }

    handleDragStarted() {
        this.setState({
            isResizing: true
        });
    }

    handleDragFinished() {
        this.setState({
            isResizing: false
        });
    }

    render() {
        const resizerStyle = {
            height: '12px',
            width: '100%',
            margin: 'auto',
            background: 'grey',
            borderLeft: '5px solid #ccc',
            cursor: 'ns-resize',
            zIndex: '1'
        };
        const resizerStyleHover = Object.assign({}, resizerStyle, {
            borderLeft: '5px solid blue'
        });

        // We define default empty pan, because the splitPan component do no work only with one pan.
        let firstPan = <div />;
        let secondPan = <div />;
        const isMediaSelected =
            this.props.media && this.props.media.properties.contentType === 'image' ? true : false;
        const isPointCloudSelected = this.props.pointCloud !== null;
        let defaultSize = '100%';
        let allowResize = false;

        if (isMediaSelected && !isPointCloudSelected) {
            firstPan = (
                <ImagePreviewer media={this.props.media} previewMode={this.props.previewMode} />
            );
        } else if (isPointCloudSelected && !isMediaSelected) {
            firstPan = (
                <PointCloudPreviewer
                    pointCloud={this.props.pointCloud}
                    previewMode={this.props.previewMode}
                />
            );
        } else if (isMediaSelected && isPointCloudSelected) {
            firstPan = (
                <ImagePreviewer media={this.props.media} previewMode={this.props.previewMode} />
            );
            secondPan = (
                <PointCloudPreviewer
                    pointCloud={this.props.pointCloud}
                    previewMode={this.props.previewMode}
                />
            );
            allowResize = true;
            defaultSize = '50%';
        }

        return (
            <SplitPane
                split="horizontal"
                defaultSize={defaultSize}
                allowResize={allowResize}
                resizerStyle={this.state.isResizing ? resizerStyleHover : resizerStyle}
                onDragStarted={this.handleDragStarted}
                onDragFinished={this.handleDragFinished}
            >
                {firstPan}
                {secondPan}
                )}
            </SplitPane>
            /*<div>
			{this.props.media.properties.contentType === 'image'
				&& <ImagePreviewer media={this.props.media}
				previewMode={this.props.previewMode}/>
			}
			{this.props.pointCloud &&
				<PointCloudPreviewer pointCloud={this.props.pointCloud}
				previewMode={this.props.previewMode} />
			}
			</div>
			*/
        );
    }
}

// Props :
// * media: currently selected media (if any),
//   inherited from MainPanel
// * pointCloud : currently selected pointcloud (if any),
//   inherited from MainPanel
// * previewMode : whether the previewer should be in preview mode (ie small) or not,
//   inherited from MainPanel
Previewer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.shape({
        properties: PropTypes.object,
        geometry: PropTypes.object
    }),
    pointCloud: PropTypes.object,
    previewMode: PropTypes.bool
};

const ConnectedPreviewer = connect(store => {
    const selectedMedias = getSelectedMedias(store);
    const selectedPointCloud = getSelectedPointCloud(store);
    return {
        previewMode: getMapPreviewMode(store),
        showPreviewer: selectedMedias.length === 1 || selectedPointCloud !== null,
        media: selectedMedias[0],
        pointCloud: selectedPointCloud
    };
})(Previewer);

export default ConnectedPreviewer;
