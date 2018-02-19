import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import styles from './interactive-image.css';

let context = null;

/** A component representing a zoomable and movable image. Implemented with canvas. */
class InteractiveImage extends React.Component {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.onResizeAnimation = this.onResizeAnimation.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        if (this.props.setResizeHandler) {
            this.props.setResizeHandler(this.handleResize);
        }
        this.initViewer();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resizeAnimationOnGoing && !this.props.resizeAnimationOnGoing) {
            this.resizeRequest = requestAnimationFrame(this.onResizeAnimation);
        }
        if (!nextProps.resizeAnimationOnGoing && this.props.resizeAnimationOnGoing) {
            cancelAnimationFrame(this.resizeRequest);
        }
        if (nextProps.mediaUrl !== this.props.mediaUrl) {
            this.media.src = nextProps.mediaUrl;
            this.setState({
                loading: true
            });
        }
    }

    initViewer() {
        this.mediaCanvas.width = this.mediaCanvas.offsetParent.clientWidth;
        this.mediaCanvas.height = this.mediaCanvas.offsetParent.clientHeight;
        this.media = new Image();
        this.media.src = this.props.mediaUrl;
        this.setState({
            loading: true
        });
        context = this.mediaCanvas.getContext('2d');
        this.trackTransforms(context);

        this.lastX = this.mediaCanvas.width / 2;
        this.lastY = this.mediaCanvas.height / 2;

        this.dragStart = null;
        this.dragged = null;
        this.scaleFactor = 1.1;

        this.media.onload = () => this.handleMediaLoad();
        this.media.onerror = e => this.handleMediaLoadError(e);
        this.mediaCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.mediaCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.mediaCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    }

    computeMouseCoords(e) {
        const rect = this.mediaCanvas.getBoundingClientRect();
        switch (this.props.quarter) {
            case 0:
                this.lastX = (e.clientX - rect.left) / (rect.right - rect.left) * rect.width;
                this.lastY = (e.clientY - rect.top) / (rect.bottom - rect.top) * rect.height;
                break;
            case 1:
                this.lastX =
                    rect.height - (e.clientY - rect.top) / (rect.bottom - rect.top) * rect.height;
                this.lastY = (e.clientX - rect.left) / (rect.right - rect.left) * rect.width;
                break;
            case 2:
                this.lastX =
                    rect.width - (e.clientX - rect.left) / (rect.right - rect.left) * rect.width;
                this.lastY =
                    rect.height - (e.clientY - rect.top) / (rect.bottom - rect.top) * rect.height;
                break;
            case 3:
                this.lastX = (e.clientY - rect.top) / (rect.bottom - rect.top) * rect.height;
                this.lastY =
                    rect.width - (e.clientX - rect.left) / (rect.right - rect.left) * rect.width;
                break;
            default:
                break;
        }
    }

    handleMediaLoad() {
        this.redraw();
        this.setState({
            loading: false
        });
    }

    handleMediaLoadError(e) {
        // Use fallback picture
        if (this.props.fallbackMediaUrl && this.props.fallbackMediaUrl !== this.props.mediaUrl) {
            e.target.src = this.props.fallbackMediaUrl;
        } else {
            this.setState({
                loading: false
            });
        }
    }

    handleMouseDown(e) {
        if (this.props.interactive) {
            e.stopPropagation();
        }
        if (!this.props.interactive) {
            return e.preventDefault();
        }
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
            'none';
        this.computeMouseCoords(e);
        this.dragStart = context.transformedPoint(this.lastX, this.lastY);
        this.dragged = false;
    }

    handleMouseUp(e) {
        if (this.props.interactive) {
            e.stopPropagation();
        }
        this.dragStart = null;
        if (!this.dragged) this.zoom(e.shiftKey ? -1 : 1);
    }

    handleMouseMove(e) {
        this.computeMouseCoords(e);
        this.dragged = true;
        if (this.dragStart) {
            const pt = context.transformedPoint(this.lastX, this.lastY);
            context.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y);
            this.redraw();
        }
    }

    onResizeAnimation() {
        this.handleResize();
        this.resizeRequest = requestAnimationFrame(this.onResizeAnimation);
    }

    handleResize() {
        if (this.mediaCanvas) {
            context = this.mediaCanvas.getContext('2d');
            this.mediaCanvas.width = this.mediaCanvas.offsetParent.clientWidth;
            this.mediaCanvas.height = this.mediaCanvas.offsetParent.clientHeight;
            this.trackTransforms(context);
            this.redraw();
        }
    }

    handleScroll(e) {
        this.computeMouseCoords(e);
        let delta;
        if (e.deltaMode === 0) {
            delta = -e.deltaY / 33;
        } else {
            delta = -e.deltaY;
        }
        const factor = Math.pow(this.scaleFactor, delta);
        const xform = context.getTransform();
        const scaledXform = xform.scaleNonUniform(factor, factor);
        const nextScale = scaledXform.a;

        if (!this.props.interactive) {
            return e.preventDefault();
        }
        if (nextScale >= 1) {
            e.stopPropagation();
            if (delta) this.zoom(delta);
            return e.preventDefault() && false;
        } else {
            e.stopPropagation();
            if (this.props.handleScrollExit) {
                this.props.handleScrollExit();
            }
        }
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

        //We draw the media fitting and centering it in the canvas
        const hRatio = this.mediaCanvas.width / this.media.width;
        const vRatio = this.mediaCanvas.height / this.media.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (this.mediaCanvas.width - this.media.width * ratio) / 2;
        const centerShift_y = (this.mediaCanvas.height - this.media.height * ratio) / 2;
        context.clearRect(0, 0, this.mediaCanvas.width, this.mediaCanvas.height);
        context.drawImage(
            this.media,
            0,
            0,
            this.media.width,
            this.media.height,
            centerShift_x,
            centerShift_y,
            this.media.width * ratio,
            this.media.height * ratio
        );

        //If we want to draw the full media without fitting and centering it in the canvas
        // context.drawImage(this.media, 0, 0);
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
        return (
            <div
                className={styles.interactiveImage}
                onClick={e => {
                    e.stopPropagation();
                }}
                onMouseDown={e => {
                    e.stopPropagation();
                }}
            >
                {this.state.loading && (
                    <div className={styles.interactiveImageLoader}>
                        <ProgressBar type="circular" mode="indeterminate" />
                    </div>
                )}
                <canvas
                    onWheel={this.handleScroll}
                    ref={mediaCanvas => (this.mediaCanvas = mediaCanvas)}
                />
            </div>
        );
    }
}

InteractiveImage.propTypes = {
    /** a fallback url of the image to display (loaded in case mediaUrl is not available)*/
    fallbackMediaUrl: PropTypes.string,
    /** function to call when user scrolls out of the media (ie zoom level is < 1), optional */
    handleScrollExit: PropTypes.func,
    /** whether image is interactive or not (zoomable/movable) */
    interactive: PropTypes.bool,
    /** the url of the image to display */
    mediaUrl: PropTypes.string.isRequired,
    /** the orientation of the canvas (0,1,2 or 3)*/
    quarter: PropTypes.number,
    /** whether an animation is on going : if so, canvas should resize on requestAnimationFrame
     * until animation is finished*/
    resizeAnimationOnGoing: PropTypes.bool,
    /** function to set resize handler so that parent can call it when a resize is necessary */
    setResizeHandler: PropTypes.func.isRequired
};

InteractiveImage.defaultProps = {
    interactive: false,
    quarter: 0,
    resizeAnimationOnGoing: false
};

export default InteractiveImage;
