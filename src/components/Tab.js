import React, { Component } from 'react'

class Tab extends Component {
  render() {
    if (this.props.isActive) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    }

    return ''
  }
}

export default Tab
