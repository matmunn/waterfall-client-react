import React, { Component } from 'react'

class Tabs extends Component {
  render() {
    const tabs = React.Children.map(this.props.children, child => {
      return (
        <li>

        </li>
      )
    })
    return (
      <div>
        <div className='tabs'>
          <ul>
            { tabs }
          </ul>
        </div>
        <div className='tab-details'>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Tabs
