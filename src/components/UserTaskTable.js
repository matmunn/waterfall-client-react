import React, { Component } from 'react'
import { ClipLoader } from 'react-spinners'
import { reduce, map } from 'lodash'
import PropTypes from 'prop-types'

import styles from './styles/UserTaskTable.scss'

import Task from './Task'

import { TaskValidator } from '@/utils/validators'

class UserTaskTable extends Component {
  static propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.shape(TaskValidator)),
    background: PropTypes.string
  }

  static defaultProps = {
    tasks: []
  }

  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  render() {
    if (!this.props.tasks.length) {
      return (
        <div className='no-tasks'>
        {
          !this.state.loading ?
          (
            <h3 className='title is-5'>
              This user doesn't have any tasks for this week.
            </h3>
          ) : (
            <ClipLoader color='#3097D1' size={30} className={styles.cliploader}></ClipLoader>
          )
        }
        </div >
      )
    }

    const totalWeeklyHours = reduce(this.props.tasks, (accumulator, item) =>  accumulator + item.blocks.length, 0)
    const completedHours = reduce(this.props.tasks, (accumulator, item) => accumulator + (item.completed ? item.blocks.length : 0), 0)
    const absenceHours = reduce(this.props.tasks, (accumulator, item) => accumulator + (item.is_absence ? item.blocks.length : 0), 0)

    return (
      <table align='center'>
        <tr className='every-cell-br2px'>
          <th rowspan='2' colspan='4' className='job-title-cell'>
            Job Title
          </th>
          <th colspan='7'>
            Monday<br />
            { this.state.startDate.format('DD/MM/YY') }
          </th>
          <th colspan='7'>
            Tuesday<br />
            { this.state.startDate.add(1, 'day').format('DD/MM/YY') }
          </th>
          <th colspan='7'>
            Wednesday<br />
            { this.state.startDate.add(2, 'days').format('DD/MM/YY') }
          </th>
          <th colspan='7'>
            Thursday<br />
            { this.state.startDate.add(3, 'days').format('DD/MM/YY') }
          </th>
          <th colspan='7'>
            Friday<br />
            { this.state.startDate.add(4, 'days').format('DD/MM/YY') }
          </th>
        </tr>
        <tr className='rotated-text'>
          {/* Monday */}
          <th>0900</th>
          <th>1000</th>
          <th>1100</th>
          <th>1200</th>
          <th>1400</th>
          <th>1500</th>
          <th>1600</th>
          {/* Tuesday */}
          <th>0900</th>
          <th>1000</th>
          <th>1100</th>
          <th>1200</th>
          <th>1400</th>
          <th>1500</th>
          <th>1600</th>
          {/* Wednesday */}
          <th>0900</th>
          <th>1000</th>
          <th>1100</th>
          <th>1200</th>
          <th>1400</th>
          <th>1500</th>
          <th>1600</th>
          {/* Thursday */}
          <th>0900</th>
          <th>1000</th>
          <th>1100</th>
          <th>1200</th>
          <th>1400</th>
          <th>1500</th>
          <th>1600</th>
          {/* Friday */}
          <th>0900</th>
          <th>1000</th>
          <th>1100</th>
          <th>1200</th>
          <th>1400</th>
          <th>1500</th>
          <th>1600</th>
        </tr>
        {
          map(this.props.tasks, task => <Task v-for='task in tasks' key={task.id} task={task} background={this.props.background} />)
        }
        <tr>
          <td></td>
          <td colspan='42'>
            { totalWeeklyHours } scheduled hours for the week, { absenceHours } hours of absences. { completedHours } hours completed, { totalWeeklyHours - completedHours } remaining.
          </td>
        </tr>
      </table>
    )
  }
}

export default UserTaskTable
