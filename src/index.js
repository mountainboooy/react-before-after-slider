/**
 * @class BeforeAfterSlider
 */

import React, { Component } from 'react'
import {Transition} from 'react-transition-group'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import BlockImage from 'react-block-image'

import styles from './styles.css'

export default class BeforeAfterSlider extends Component {
  static propTypes = {
    before: PropTypes.string.isRequired,
    after: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    defaultProgress: PropTypes.number,
    className: PropTypes.string,
    beforeClassName: PropTypes.string,
    afterClassName: PropTypes.string,
    beforeProps: PropTypes.object,
    afterProps: PropTypes.object
  }

  static defaultProps = {
    defaultProgress: 0.5,
    beforeProps: { },
    afterProps: { }
  }

  state = {
    progress: this.props.defaultProgress,
    transitionIn: false
  }

  onMouseLeave () {
    this.setState({transitionIn: true})
  }

  onMouseEnter () {

    this.setState({transitionIn: false})
  }

  render() {
    const {
      before,
      after,
      className,
      defaultProgress,
      beforeClassName,
      afterClassName,
      beforeProps,
      afterProps,
      width,
      height,
      ...rest
    } = this.props

    const {
      progress
    } = this.state

    const defaultAfterStyle = {
      width: `${100 * this.state.progress}%`,
    }

    const transitionAfterStyles = {
      entering: {width: `${100 * this.state.progress}%`},
      entered: {width: this.state.progress < .5 ? 0 : '100%', transition: '300ms'}
    }

    const defaultLineStyle = {
      left: `${100 * progress}%`
    }

    const transitionLineStyles = {
      entering: {left: `${100 * progress}%`},
      entered: {left: this.state.progress < .5 ? 0 : '100%', transition: '300ms'}
    }

    return (
      <div
        className={classNames(styles.container, className)}
        style={{
          width,
          height
        }}
        {...rest}
        onMouseLeave={this.onMouseLeave.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
      >
      <Transition in={this.state.transitionIn} timeout={300}>
        {(state) => {
          return (
            <div
              className={styles.afterWrapper}
              style={{...defaultAfterStyle, ...transitionAfterStyles[state]}}
            >
              <BlockImage
                src={after}
                className={classNames(styles.after, afterClassName)}
                style={{ width }}
                {...afterProps}
              />
            </div>
          )
        }}
      </Transition>

        <BlockImage
          src={before}
          className={classNames(styles.before, beforeClassName)}
          {...beforeProps}
        />

        <Transition in={this.state.transitionIn} timeout={300}>
        {
          (state) => {
            return (
              <div
                className={styles.handle}
                style={{
                  ...defaultLineStyle, ...transitionLineStyles[state]
                }}
              />
            )
          }
        }

        </Transition>

        <div
          className={styles.wrapper}
          ref={this._contentRef}
          onTouchMove={this._onMoveWrapper}
          onMouseMove={this._onMoveWrapper}
        />

        <div
          className={styles.content}
          onTouchMove={this._onMoveContent}
          onMouseMove={this._onMoveContent}
        />

      </div>
    )
  }

  _contentRef = (ref) => {
    this._content = ref
  }

  _onMoveWrapper = (event) => {
    event.preventDefault()
    let { offsetX } = event.nativeEvent
    if (!offsetX) {
      const rect = event.target.getBoundingClientRect()
      offsetX = event.targetTouches[0].pageX - rect.left
    }
    const { width } = this.props
    const progress = Math.max(0, Math.min(1, (offsetX - width / 10) / width))
    this.setState({ progress })
  }

  _onMoveContent = (event) => {
    event.preventDefault()
    let { offsetX } = event.nativeEvent
    if (!offsetX) {
      const rect = event.target.getBoundingClientRect()
      offsetX = event.targetTouches[0].pageX - rect.left
    }
    const { width } = this.props
    const progress = Math.max(0, Math.min(1, offsetX / width))
    this.setState({ progress })
  }
}
