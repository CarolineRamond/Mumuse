import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import styles from './interactive-image.css';
import * as utils from './utils';

let context = null;

/** A component representing a zoomable and movable image. Implemented with canvas. */
class InteractiveImage extends React.Component {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.onResizeAnimation = this.onResizeAnimation.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handlePointsChange = this.handlePointsChange.bind(this);
        this.redraw = this.redraw.bind(this);

        this.state = {
            loading: false,
            points: this.props.points,
            pointSize: this.props.pointSize,
            pointWeight: this.props.pointWeight,
            defaultPointColor: this.props.defaultPointColor
        };
    }

    componentDidMount() {
        // setup handlers
        if (this.props.setResizeHandler) {
            this.props.setResizeHandler(this.handleResize);
        }
        if (this.props.setPointsChangedHandler) {
            this.props.setPointsChangedHandler(this.handlePointsChange);
        }
        this.initViewer();
    }

    componentWillReceiveProps(nextProps) {
        // start resizing canvas on request animation frame
        if (nextProps.resizeAnimationOnGoing && !this.props.resizeAnimationOnGoing) {
            this.resizeRequest = requestAnimationFrame(this.onResizeAnimation);
        }
        // stop resizing canvas on request animation frame
        if (!nextProps.resizeAnimationOnGoing && this.props.resizeAnimationOnGoing) {
            cancelAnimationFrame(this.resizeRequest);
        }
        // change image url
        if (nextProps.mediaUrl !== this.props.mediaUrl) {
            this.media.src = nextProps.mediaUrl;
            this.setState({
                loading: true
            });
        }
        // modify cursor if addMode is off
        if (!nextProps.addMode && this.props.addMode) {
            this.mediaCanvas.style.cursor = 'default';
        }

        // update state's point list
        this.setState({
            points: nextProps.points
        });

        //update default color
        if (nextProps.defaultPointColor !== this.props.defaultPointColor) {
            this.setState(
                {
                    defaultPointColor: nextProps.defaultPointColor
                },
                () => {
                    this.redraw();
                }
            );
        }

        //update point size
        if (nextProps.pointSize !== this.props.pointSize) {
            this.setState(
                {
                    pointSize: nextProps.pointSize
                },
                () => {
                    this.redraw();
                }
            );
        }

        //update point weight
        if (nextProps.pointWeight !== this.props.pointWeight) {
            this.setState(
                {
                    pointWeight: nextProps.pointWeight
                },
                () => {
                    this.redraw();
                }
            );
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

        // init variables
        this.scaleFactor = 1.1;
        // => image drag
        this.imgDragStart = null;
        this.didDragImg = false;
        // => point drag
        this.intersectedPoint = null;
        this.draggedPoint = null;
        this.didDragPoint = false;

        this.media.onload = () => this.handleMediaLoad();
        this.media.onerror = e => this.handleMediaLoadError(e);
        // disable context menu when right-click on canvas
        this.mediaCanvas.oncontextmenu = e => {
            e.preventDefault();
        };
        this.mediaCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.mediaCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.mediaCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    }

    handlePointsChange(newPoints) {
        this.setState(
            {
                points: newPoints
            },
            () => {
                this.redraw();
            }
        );
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
        this.handleResize();
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
        e.preventDefault();
        if (this.props.interactive) {
            e.stopPropagation();
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
                'none';
            this.computeMouseCoords(e);

            const rightClick = e.which === 3;
            if (rightClick) {
                // handle image drag start
                this.imgDragStart = context.transformedPoint(this.lastX, this.lastY);
                this.didDragImg = false;
                return;
            }
            if (this.props.bindMode) {
                // handle point bind
                this.props.onSelectPoint(this.pointIntersected);
                return;
            }
            if (this.props.addMode && this.props.onAddPoint && this.mouseImageCoords) {
                // add point
                this.props.onAddPoint(this.mouseImageCoords);
                return;
            }
            if (!this.props.addMode && !this.props.deleteMode && this.pointIntersected) {
                // handle point drag start
                this.draggedPoint = this.pointIntersected;
                this.didDragPoint = false;
                return;
            }
        }
    }

    handleMouseUp(e) {
        e.preventDefault();
        if (this.props.interactive) {
            e.stopPropagation();

            // handle end drag image
            this.imgDragStart = null;
            this.didDragImg = false;

            // handle delete point
            if (this.props.deleteMode && this.pointIntersected) {
                this.props.onRemovePoint(this.pointIntersected.id);
            }

            // handle end drag point
            if (this.draggedPoint) {
                // a point was dragged : update it
                if (this.didDragPoint) {
                    this.props.onUpdatePoint(this.draggedPoint.id, this.mouseImageCoords);
                }
                this.draggedPoint = null;
                this.didDragPoint = false;
            }

            // zoom if addMode is disabled & user was not dragging
            // if (!this.dragged && !this.props.addMode) {
            //     this.zoom(e.shiftKey ? -1 : 1);
            // }
        }
    }

    handleMouseMove(e) {
        this.computeMouseCoords(e);
        const pt = context.transformedPoint(this.lastX, this.lastY);

        if (this.imgDragStart) {
            // handle drag image
            this.didDragImg = true;
            context.translate(pt.x - this.imgDragStart.x, pt.y - this.imgDragStart.y);
            this.redraw();
        } else if (this.isCanvasPointIntoImage(pt)) {
            // mouse is inside photo
            this.mouseImageCoords = this.canvasToImage(pt);
            if (this.draggedPoint) {
                // handle drag point
                this.didDragPoint = true;
                this.draggedPoint.x = pt.x;
                this.draggedPoint.y = pt.y;
                this.redraw();
            } else if (this.props.addMode) {
                // handle add point
                this.mediaCanvas.style.cursor = 'crosshair';
            } else if (this.state.points) {
                // check intersected point
                const intersectedPoints = this.intersect(
                    pt,
                    this.state.points,
                    this.state.pointSize
                );
                const formerIntersected = this.pointIntersected;
                this.pointIntersected = intersectedPoints[0];
                if (
                    (formerIntersected && !this.pointIntersected) ||
                    (this.pointIntersected && !formerIntersected) ||
                    (this.pointIntersected &&
                        formerIntersected &&
                        this.pointIntersected.id !== formerIntersected.id)
                ) {
                    this.redraw();
                }
            }
        } else {
            // mouse is outside photo
            this.mediaCanvas.style.cursor = 'default';
            this.mouseImageCoords = null;
        }
    }

    onResizeAnimation() {
        this.handleResize();
        this.resizeRequest = requestAnimationFrame(this.onResizeAnimation);
    }

    handleResize() {
        if (this.mediaCanvas) {
            context = this.mediaCanvas.getContext('2d');
            // readapt canvas size to parent size
            this.mediaCanvas.width = this.mediaCanvas.offsetParent.clientWidth;
            this.mediaCanvas.height = this.mediaCanvas.offsetParent.clientHeight;

            // recompute image dimensions
            const hRatio = this.mediaCanvas.width / this.media.width;
            const vRatio = this.mediaCanvas.height / this.media.height;
            const ratio = Math.min(hRatio, vRatio);
            this.imgDim = {
                width: this.media.width * ratio,
                height: this.media.height * ratio
            };
            this.imgCenter = {
                x: this.mediaCanvas.width / 2,
                y: this.mediaCanvas.height / 2
            };
            this.imgNWCorner = {
                x: this.imgCenter.x - this.imgDim.width / 2,
                y: this.imgCenter.y - this.imgDim.height / 2
            };

            // reset canvas-image transformation functions
            this.canvasToImage = utils.canvasToImageFactory(this.imgNWCorner, this.imgDim);
            this.imageToCanvas = utils.imageToCanvasFactory(this.imgNWCorner, this.imgDim);
            this.isCanvasPointIntoImage = utils.isCanvasPointIntoImageFactory(
                this.imgNWCorner,
                this.imgDim
            );
            this.intersect = utils.intersectFactory(this.imgNWCorner, this.imgDim);

            // reset track transform + redraw
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
        context.clearRect(0, 0, this.mediaCanvas.width, this.mediaCanvas.height);
        context.drawImage(
            this.media,
            0,
            0,
            this.media.width,
            this.media.height,
            this.imgNWCorner.x,
            this.imgNWCorner.y,
            this.imgDim.width,
            this.imgDim.height
        );

        // We draw the points relatively to the media
        if (this.state.points) {
            this.state.points.map(point => {
                let pointCanvasCoords = this.imageToCanvas(point);
                if (this.draggedPoint && this.draggedPoint.id === point.id) {
                    pointCanvasCoords = this.draggedPoint;
                }
                let color = point.color || this.state.defaultPointColor;
                if (
                    (this.pointIntersected && point.id === this.pointIntersected.id) ||
                    point.selected
                ) {
                    color = 'green';
                }
                const shouldDisplayCircle = point.bind !== null;
                this.drawPoint(pointCanvasCoords, color, shouldDisplayCircle);
            });
        }
    }

    drawPoint(coords, color, shouldDisplayCircle) {
        const X = coords.x;
        const Y = coords.y;
        const pointSize = this.state.pointSize;
        const pointWeight = this.state.pointWeight;

        // gradient
        const grd = context.createRadialGradient(X + 2, Y + 2, 0, X + 2, Y + 2, pointSize);
        grd.addColorStop(0, 'rgba(0,0,0,0.3)');
        grd.addColorStop(1, 'transparent');
        context.fillStyle = grd;
        context.fillRect(X + 2 - pointSize, Y + 2 - pointSize, pointSize * 2, pointSize * 2);

        // shadow vertical bar, black
        context.lineWidth = pointWeight;
        context.strokeStyle = 'rgba(0,0,0,0.3)';
        context.beginPath();
        context.moveTo(X + 0.5, Y - pointSize / 2 + 0.5);
        context.lineTo(X + 0.5, Y + pointSize / 2 + 0.5);
        context.stroke();

        // shadow horizontal bar, black
        context.lineWidth = pointWeight;
        context.strokeStyle = 'rgba(0,0,0,0.3)';
        context.beginPath();
        context.moveTo(X - pointSize / 2 + 0.5, Y + 0.5);
        context.lineTo(X + pointSize / 2 + 0.5, Y + 0.5);
        context.stroke();

        // point vertical bar, colored
        context.lineWidth = pointWeight;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(X, Y - pointSize / 2);
        context.lineTo(X, Y + pointSize / 2);
        context.stroke();

        // point horizontal bar, colored
        context.lineWidth = pointWeight;
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(X - pointSize / 2, Y);
        context.lineTo(X + pointSize / 2, Y);
        context.stroke();

        // circle
        if (shouldDisplayCircle) {
            context.lineWidth = pointWeight;
            context.strokeStyle = color;
            context.beginPath();
            context.arc(X, Y, pointSize, 0, 2 * Math.PI);
            context.stroke();
        }
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
    /** whether add point mode is active or not*/
    addMode: PropTypes.bool,
    /** whether bind point mode is active or not*/
    bindMode: PropTypes.bool,
    defaultPointColor: PropTypes.string,
    /** whether delete point mode is active or not*/
    deleteMode: PropTypes.bool,
    /** a fallback url of the image to display (loaded in case mediaUrl is not available)*/
    fallbackMediaUrl: PropTypes.string,
    /** function to call when user scrolls out of the media (ie zoom level is < 1), optional */
    handleScrollExit: PropTypes.func,
    /** whether image is interactive or not (zoomable/movable) */
    interactive: PropTypes.bool,
    /** the url of the image to display */
    mediaUrl: PropTypes.string.isRequired,
    /** add point function */
    onAddPoint: PropTypes.func,
    /** remove point function */
    onRemovePoint: PropTypes.func,
    /** select point function */
    onSelectPoint: PropTypes.func,
    /** update point function */
    onUpdatePoint: PropTypes.func,
    pointSize: PropTypes.number,
    /** list of points to draw on the image (with coords relative to image center)*/
    points: PropTypes.arrayOf(PropTypes.object),
    pointWeight: PropTypes.number,
    /** the orientation of the canvas (0,1,2 or 3)*/
    quarter: PropTypes.number,
    /** whether an animation is on going : if so, canvas should resize on requestAnimationFrame
     * until animation is finished*/
    resizeAnimationOnGoing: PropTypes.bool,
    /** function to set points change handler so that parent can call it when redraw points should occur */
    setPointsChangedHandler: PropTypes.func.isRequired,
    /** function to set resize handler so that parent can call it when a resize is necessary */
    setResizeHandler: PropTypes.func.isRequired
};

InteractiveImage.defaultProps = {
    interactive: false,
    points: null,
    quarter: 0,
    resizeAnimationOnGoing: false
};

export default InteractiveImage;
