import React from 'react';
import PropTypes from 'prop-types';

class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.resizerWidth = 6;
        this.sliderKnotSize = {
            default: 20,
            dragging: 30
        };

        this.handleResizerMouseDown = this.handleResizerMouseDown.bind(this);
        this.handleResizerMouseUp = this.handleResizerMouseUp.bind(this);
        this.handleResizerMouseMove = this.handleResizerMouseMove.bind(this);

        this.handleSliderMouseDown = this.handleSliderMouseDown.bind(this);
        this.handleSliderMouseUp = this.handleSliderMouseUp.bind(this);
        this.handleSliderMouseMove = this.handleSliderMouseMove.bind(this);

        let cursorLeft;
        let cursorTop;
        switch (this.props.dimensions.quarter) {
            case 0:
                cursorLeft = this.props.init.imgClip;
                cursorTop = 100 * (1 - this.props.init.imgOpacity);
                break;
            case 1:
                cursorLeft = this.props.init.imgClip;
                cursorTop = 100 * this.props.init.imgOpacity;
                break;
            case 2:
                cursorLeft = 100 - this.props.init.imgClip;
                cursorTop = 100 * this.props.init.imgOpacity;
                break;
            case 3:
                cursorLeft = 100 - this.props.init.imgClip;
                cursorTop = 100 * (1 - this.props.init.imgOpacity);
                break;
            default:
                break;
        }
        this.state = {
            cursorLeft: cursorLeft,
            cursorTop: cursorTop,
            isResizing: false,
            isSliding: false
        };
    }

    handleResizerMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        document.body.style.cursor = 'ew-resize';
        document.addEventListener('mousemove', this.handleResizerMouseMove);
        document.addEventListener('mouseup', this.handleResizerMouseUp);
        this.setState({
            isResizing: true
        });
    }

    handleResizerMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', this.handleResizerMouseMove);
        document.removeEventListener('mouseup', this.handleResizerMouseUp);
        this.setState({
            isResizing: false
        });
    }

    handleResizerMouseMove(event) {
        event.preventDefault();
        event.stopPropagation();
        const alpha = this.props.dimensions.alpha * Math.PI / 180;
        const X = event.clientX - this.props.dimensions.parentWidth / 2;
        const Y = event.clientY - this.props.dimensions.parentHeight / 2;
        let x;
        if (this.props.dimensions.quarter % 2 === 0) {
            x =
                (X * Math.cos(alpha) - Y * Math.sin(alpha) + this.props.dimensions.width / 2) /
                this.props.dimensions.width *
                100;
        } else {
            x =
                (X * Math.sin(alpha) + Y * Math.cos(alpha) + this.props.dimensions.height / 2) /
                this.props.dimensions.height *
                100;
        }
        const cursorLeft = Math.max(0, Math.min(100, x));
        this.setState({
            cursorLeft: cursorLeft
        });
        let newClip;
        switch (this.props.dimensions.quarter) {
            case 0:
            case 1:
                newClip = cursorLeft;
                break;
            case 2:
            case 3:
                newClip = 100 - cursorLeft;
                break;
            default:
                break;
        }
        this.props.handleClip(newClip);
    }

    handleSliderMouseDown(event) {
        event.preventDefault();
        // event.stopPropagation();
        // uncomment this line to decorrelate opacity change and resize
        document.body.style.cursor = 'ns-resize';
        document.addEventListener('mousemove', this.handleSliderMouseMove);
        document.addEventListener('mouseup', this.handleSliderMouseUp);
        this.setState({
            isSliding: true
        });
    }

    handleSliderMouseUp(event) {
        event.preventDefault();
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', this.handleSliderMouseMove);
        document.removeEventListener('mouseup', this.handleSliderMouseUp);
        this.setState({
            isSliding: false
        });
    }

    handleSliderMouseMove(event) {
        event.preventDefault();
        const alpha = this.props.dimensions.alpha * Math.PI / 180;
        const X = event.clientX - this.props.dimensions.parentWidth / 2;
        const Y = event.clientY - this.props.dimensions.parentHeight / 2;
        let y;
        if (this.props.dimensions.quarter % 2 === 0) {
            y =
                (X * Math.sin(alpha) + Y * Math.cos(alpha) + this.props.dimensions.height / 2) /
                this.props.dimensions.height *
                100;
        } else {
            y =
                (X * Math.cos(alpha) - Y * Math.sin(alpha) + this.props.dimensions.width / 2) /
                this.props.dimensions.width *
                100;
        }
        const cursorTop = Math.max(0, Math.min(100, y));
        this.setState({
            cursorTop: cursorTop
        });
        let newOpacity;
        switch (this.props.dimensions.quarter) {
            case 0:
            case 3:
                newOpacity = 1 - cursorTop / 100;
                break;
            case 1:
            case 2:
                newOpacity = cursorTop / 100;
                break;
            default:
                break;
        }
        this.props.handleOpacityChange(newOpacity);
    }

    render() {
        const sliderKnotSize = this.state.isSliding
            ? this.sliderKnotSize.dragging
            : this.sliderKnotSize.default;
        const sliderKnotShadow = this.state.isSliding ? '0 0 5px rgba(255,255,255,0.5)' : 'none';
        const resizerShadow = this.state.isResizing ? '0 0 2px rgba(255,255,255,0.5)' : 'none';

        const resizerStyle = {
            position: 'absolute',
            width: `${this.resizerWidth}px`,
            backgroundColor: 'white',
            cursor: 'ew-resize',
            boxShadow: resizerShadow,
            zIndex: 3
        };

        const sliderStyle = {
            position: 'absolute',
            height: `${sliderKnotSize}px`,
            width: `${sliderKnotSize}px`,
            borderRadius: '50%',
            backgroundColor: 'white',
            cursor: 'ns-resize',
            left: `-${(sliderKnotSize - this.resizerWidth) / 2}px`,
            boxShadow: sliderKnotShadow,
            marginTop: `-${sliderKnotSize / 2}px`
        };

        switch (this.props.dimensions.quarter) {
            case 0:
                resizerStyle.height = `${this.props.dimensions.height}px`;
                resizerStyle.top = 0;
                resizerStyle.left = `${this.state.cursorLeft}%`;
                sliderStyle.top = `${this.state.cursorTop}%`;
                break;
            case 1:
                resizerStyle.height = `${this.props.dimensions.width}px`;
                resizerStyle.top = `${this.state.cursorLeft}%`;
                resizerStyle.left = 0;
                resizerStyle.transformOrigin = '0 0';
                resizerStyle.transform = `translateX(${
                    this.props.dimensions.width
                }px) rotate(90deg)`;
                sliderStyle.top = `${100 - this.state.cursorTop}%`;
                break;
            case 2:
                resizerStyle.height = `${this.props.dimensions.height}px`;
                resizerStyle.top = 0;
                resizerStyle.left = `${this.state.cursorLeft}%`;
                resizerStyle.transformOrigin = '0 0';
                resizerStyle.transform = `translateY(${
                    this.props.dimensions.height
                }px) rotate(180deg) `;
                sliderStyle.top = `${100 - this.state.cursorTop}%`;
                break;
            case 3:
                resizerStyle.height = this.props.dimensions.width;
                resizerStyle.top = `${this.state.cursorLeft}%`;
                resizerStyle.left = 0;
                resizerStyle.transformOrigin = '0 0';
                resizerStyle.transform = 'rotate(-90deg)';
                sliderStyle.top = `${this.state.cursorTop}%`;
                break;
            default:
                break;
        }

        return (
            <div style={resizerStyle} onMouseDown={this.handleResizerMouseDown}>
                <div style={sliderStyle} onMouseDown={this.handleSliderMouseDown} />
            </div>
        );
    }
}

Slider.propTypes = {
    dimensions: PropTypes.shape({
        alpha: PropTypes.number.isRequired,
        quarter: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        parentWidth: PropTypes.number.isRequired,
        parentHeight: PropTypes.number.isRequired
    }).isRequired,
    handleClip: PropTypes.func.isRequired,
    handleOpacityChange: PropTypes.func.isRequired,
    init: PropTypes.shape({
        imgOpacity: PropTypes.number.isRequired,
        imgClip: PropTypes.number.isRequired
    }).isRequired
};

export default Slider;
