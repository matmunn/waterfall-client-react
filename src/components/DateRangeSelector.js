import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'
import moment from 'moment'

class DateRangeSelector extends Component {
  static propTypes = {
    className: PropTypes.string,
    dateFormat: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(moment).isRequired,
    endDate: PropTypes.instanceOf(moment).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  setDate = date => {
    this.props.onChange({
      start: date.clone().day(1),
      end: date.clone().day(5)
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="field has-addons has-addons-centered">
          <div className="control">
            <DatePicker
              className='input'
              dateFormat={this.props.dateFormat}
              onChange={date => this.setDate(date)}
              selected={this.props.startDate}
            />
          </div>
          <p className="control">
            <span className="button is-static">
              to
            </span>
          </p>
          <div className="control">
            <DatePicker
              className='input'
              dateFormat={this.props.dateFormat}
              onChange={date => this.setDate(date)}
              selected={this.props.endDate}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default DateRangeSelector
