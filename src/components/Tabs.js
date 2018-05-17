import React, { Component } from 'react'
import classNames from 'classnames'

class Tabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: ''
    }
  }

  selectTab = selectedTab => {
    this.setState({ activeTab: selectedTab.name })
  }

  renderTabs = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        isActive: child.name === this.state.activeTab,
        key: child.id
      })
    })
  }

  render() {
    const tabs = React.Children.map(this.props.children, (child, i) => {
      return (
        <li key={i} className={classNames({ "is-active": child.name === this.state.activeTab })}>
          <a onClick={() => this.selectTab(child)}>
            { child.props.name }
          </a>
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
          { this.renderTabs() }
        </div>
      </div>
    )
  }
}

export default Tabs
