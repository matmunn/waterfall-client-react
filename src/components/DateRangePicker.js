import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment'
import PropTypes from 'prop-types'
require('savi-bootstrap-daterangepicker')

class DateRangePicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      datepickerId: props.id || 'daterangepicker',
    }
  }

  updateDates = (startDate, endDate) => {
    this.props.onChange({
      start: startDate,
      end: endDate
    })
  }

  componentDidMount() {
    $(`#${this.state.datepickerId}`).daterangepicker({
      timePicker: true,
      timePicker24Hour: true,
      timePickerIncrement: 60,
      autoApply: true,
      startDate: this.props.startTime || moment().minute(0),
      endDate: this.props.endTime || moment().add(2, 'hour').minute(0),
      disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 18, 19, 20, 21, 22, 23],
      locale: {
        format: 'YYYY-MM-DD HH:mm'
      },
      icons: {
        calendar: ''
      }
    }, (start, end, label) => {
      this.updateDates(moment(start).format('YYYY-MM-DD HH:mm'), moment(end).format('YYYY-MM-DD HH:mm'))
    })
  }

  render() {
    return (
      <div>
        <input id={this.state.datepickerId} type='text' className="input" readOnly />
      </div>
    )
  }
}

export default DateRangePicker
