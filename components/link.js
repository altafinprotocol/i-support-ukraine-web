import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

export default class InternalLink extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    url: PropTypes.string,
    external: PropTypes.bool,
    classes: PropTypes.string
  }

  static defaultProps = {
    text: '',
    url: '',
    external: false,
    classes: ''
  }

  render () {
    const { text, url, external, classes } = this.props
    if (external) {
      return (
        <a href={url} className={classes}>{text}</a>
      )
    }
    if (url.length === 0 || url === '#') {
      return (
        <a href='' className={classes}>{text}</a>
      )
    }
    return (
      <Link href={url} as={url}>
        <a className={classes}>{text}</a>
      </Link>
    )
  }
}
