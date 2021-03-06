import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'

import helpers from 'Helpers'
import { TaskValidator } from '@/utils/validators'

import NoteModal from './NoteModal'

import { clientSelector } from '@/store/selectors/clients'
import { userSelector } from '@/store/selectors/users'
import { taskNotesSelector } from '@/store/selectors/notes'

import { dispatchMarkTaskComplete, dispatchMarkTaskIncomplete } from '@/store/modules/tasks'

import styles from './styles/Task.scss'

const mapStateToProps = state => ({
  client: clientId => clientSelector(clientId)(state),
  user: userId => userSelector(userId)(state),
  notes: taskId => taskNotesSelector(taskId)(state),
})

const mapDispatchToProps = dispatch => ({
  markTaskComplete: taskId => dispatchMarkTaskComplete(dispatch, taskId),
  markTaskIncomplete: taskId => dispatchMarkTaskIncomplete(dispatch, taskId),
})

class Task extends Component {
  static propTypes = {
    background: PropTypes.string,
    task: PropTypes.shape(TaskValidator)
  }

  static defaultProps = {
    background: 'AEAEAE'
  }

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  title = () => {
    const createdAt = moment(this.props.task.created_at)
    const client = this.props.client(this.props.task.client_id) ? this.props.client(this.props.task.client_id).name : ''
    const accountManager = this.props.user(this.props.client(this.props.task.client_id).account_manager_id) ? this.props.user(this.props.client(this.props.task.client_id).account_manager_id).name : ''

    return `${this.props.task.description}\n` +
      `\nClient: ${client}\n` +
      `Account Manager: ${accountManager}\n` +
      `\nCreated on ${createdAt.format('D MMM [at] HH:mm')} by ${this.props.user(this.props.task.created_by).name || 'Unknown'}`
  }

  fillClasses = () => {
    let classes = styles.filler
    if (this.props.task.task_added_during_week) {
      classes += ` ${styles.addedDuringWeek}`
    }
    return classes
  }

  backgroundColor = () => {
    let color = this.props.background
    if (this.props.task.is_absence) {
      color = 'f06767'
    }
    return {
      backgroundColor: `#${color}`,
      color: `#${color}`
    }
  }

  markCompleted = () => {
    return this.props.markTaskComplete(this.props.task.id).catch(() => {
      helpers.toastr.error(`There was an error and your task couldn't be marked as complete.`, 'Error')
    })
  }

  markIncomplete = () => {
    return this.props.markTaskIncomplete(this.props.task.id).catch(() => {
      helpers.toastr.error(`There was an error and your task couldn't be marked as incomplete.`, 'Error')
    })
  }

  shadeCell = cell => {
    return this.props.task.blocks.indexOf(cell) > -1
  }

  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  render() {
    let cells = []
    for (let i = 0; i < 35; i++) {
      cells.push((
        <td key={i}>
          {
            this.shadeCell(i) ? (
              <div className={this.fillClasses()} style={this.backgroundColor()}>
                <i className="fa fa-square fa-lg"></i>
              </div>
            ) : null
          }
        </td>
      ))
    }

    const notes = this.props.notes(this.props.task.id)

    let classNameObject = {}
    classNameObject[styles.strikethrough] = this.props.task.completed

    return (
      <tr className={classNames(classNameObject, styles.Task)}>
        <td title={this.title()}>
          { this.props.client(this.props.task.client_id).name }
        </td>
        <td title={this.title()} className='job-description'>
          { this.props.task.description }
        </td>
        <td>
          { this.props.task.blocks.length }h
        </td>
        <td className={styles.checkMark}>
          {
            !this.props.task.completed ? (
              <i className="fa fa-check" onClick={() => this.markCompleted()}></i>
            ) : (
              <i className="fa fa-times" onClick={() => this.markIncomplete()}></i>
            )
          }
          <i className="fa fa-comment-o" onClick={() => this.showModal()}></i>
          ({ notes.length })
          <NoteModal notes={notes} task={this.props.task} modalVisible={this.state.modalVisible} onHideModal={() => this.hideModal()} />
        </td>
        {cells}
      </tr>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)
