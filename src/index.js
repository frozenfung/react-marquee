import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const FPS = 20;
const STEP = 1;
const TIMEOUT = 1 / FPS * 1000;

class Marquee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animatedHeight: 0,
      overflowHeight: 0
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  componentDidMount() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentDidUpdate() {
    this._measureText();

    if (this.props.hoverToStop) {
      this._startAnimation();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._marqueeTimer);
  }

  componentWillReceiveProps(nextProps) {
          if(this.props.text.length != nextProps.text.length)
          {
              clearTimeout(this._marqueeTimer);
              this.setState({
                animatedHeight: 0
              });
          }
  }

  handleMouseEnter() {
    if (this.props.hoverToStop) {
      clearTimeout(this._marqueeTimer);
    }
    else if (this.state.overflowHeight > 0){
      this._startAnimation();
    }
  }

  handleMouseLeave() {
    if (this.props.hoverToStop && this.state.overflowHeight > 0) {
      this._startAnimation();
    }
    else {
      clearTimeout(this._marqueeTimer);
      this.setState({
        animatedHeight: 0
      });
    }
  }

  render() {
    const style = {
      'position': 'relative',
      'bottom': this.state.animatedHeight,
      'font-size': '18px',
    };

    if (this.state.overflowHeight < 0) {
      return (
        <div className={`ui-marquee ${this.props.className}`} style={{overflow: 'hidden', height: '20px'}}>
          <span ref="text" style={style} title={this.props.text}>{this.props.text}</span>
        </div>
      );
    }
    else {
      return (
        <div className={`ui-marquee ${this.props.className}`} style={{overflow: 'hidden', height: '20px'}}
             onMouseEnter={this.handleMouseEnter}
             onMouseLeave={this.handleMouseLeave}>
          <span ref="text" style={style} title={this.props.text}>{this.props.text}</span>
        </div>
      );
    }
  }

  _startAnimation() {
    clearTimeout(this._marqueeTimer);
    const isLeading = this.state.animatedHeight === 0;
    const timeout = isLeading ? this.props.leading : TIMEOUT;

    const animate = () => {
      const {overflowHeight} = this.state;
      let animatedHeight = this.state.animatedHeight + STEP;
      const isRoundOver = animatedHeight > overflowHeight;

      if (isRoundOver) {
        if (this.props.loop) {
          animatedHeight = 0;
        }
        else {
          return;
        }
      }

      if (isRoundOver && this.props.trailing) {
        this._marqueeTimer = setTimeout(() => {
          this.setState({
            animatedHeight
          });

          this._marqueeTimer = setTimeout(animate, TIMEOUT);
        }, this.props.trailing);
      }
      else {
        this.setState({
          animatedHeight
        });

        this._marqueeTimer = setTimeout(animate, TIMEOUT);
      }
    };

    this._marqueeTimer = setTimeout(animate, timeout);
  }

  _measureText() {
    const container = ReactDOM.findDOMNode(this);
    const node = ReactDOM.findDOMNode(this.refs.text);

    if (container && node) {
      const containerHeight = container.offsetHeight;
      const textHeight = node.offsetHeight;
      const overflowHeight = textHeight - containerHeight;

      if (overflowHeight !== this.state.overflowHeight) {
        this.setState({
          overflowHeight
        });
      }
    }
  }
}

Marquee.defaultProps = {
  text: [],
  hoverToStop: false,
  loop: false,
  leading: 0,
  trailing: 0
}

Marquee.propTypes = {
  text: PropTypes.array,
  hoverToStop: PropTypes.bool,
  loop: PropTypes.bool,
  leading: PropTypes.number,
  trailing: PropTypes.number,
  className: PropTypes.string
}

module.exports = Marquee;
