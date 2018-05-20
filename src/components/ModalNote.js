import React, { Component } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { connect } from 'react-redux'
import makeCancelable from 'makecancelable'

import { toastr } from 'Helpers'

import { userSelector } from '@/store/selectors/users'
import { dispatchDeleteNote, dispatchEditNote } from '@/store/reducers/notes'

import styles from './styles/ModalNote.scss'

const mapStateToProps = state => ({
  getUser: userId => userSelector(userId)(state)
})

const mapDispatchToProps = dispatch => ({
  deleteNote: noteId => dispatchDeleteNote(dispatch, noteId),
  editNote: noteData => dispatchEditNote(dispatch, noteData),
})

class ModalNote extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      pendingDelete: false,
      noteMessage: this.props.note.message,
      deleteLoading: false,
      editLoading: false
    }
  }

  saveNote = e => {
    e.preventDefault()

    this.setState({
      editLoading: true
    })

    const noteData = {
      message: this.state.noteMessage,
      id: this.props.note.id
    }

    this.cancelEditNote = makeCancelable(
      this.props.editNote(noteData),
      () => {
        this.setState({
          editing: false,
          editLoading: false
        })
      },
      () => {
        this.cancelEdit()
        this.setState({
          editLoading: false
        })

        toastr.error(`There was an error updating the note.`, 'Error')
      }
    )
  }

  enableEdit = () => {
    this.setState({
      editing: true,
      pendingDelete: false
    })
  }

  cancelEdit = () => {
    this.setState({
      editing: false,
      noteMessage: this.props.note.message,
    })
  }

  toggleDeleteMode = () => {
    this.setState({
      pendingDelete: !this.state.pendingDelete,
      editing: !this.state.pendingDelete ? false : this.state.editing
    })
  }

  confirmDeleteNote = () => {
    this.setState({ deleteLoading: true })

    this.cancelDeleteNote = makeCancelable(
      this.props.deleteNote(this.props.note.id),
      () => {
        this.setState({
          editing: false,
          editLoading: false
        })
      },
      () => {
        this.cancelEdit()
        this.setState({ editLoading: false })

        toastr.error(`There was an error updating the note.`, 'Error')
      }
    )
  }

  componentWillUnmount() {
    if (this.cancelDeleteNote) {
      this.cancelDeleteNote()
    }
    if (this.cancelEditNote) {
      this.cancelEditNote()
    }
  }

  getUsername = () => {
    return this.props.getUser(this.props.note.created_by).name || 'Unknown'
  }

  render() {
    const createdAt = moment(this.props.note.created_at)
    const updatedAt = moment(this.props.note.updated_at)
    const newestDate =  createdAt > updatedAt ? createdAt.format('YYYY-MM-DD HH:mm:ss') : updatedAt.format('YYYY-MM-DD HH:mm:ss')

    return (
      <div className={styles.ModalNote}>
        <div className="columns">
          <div className="column is-10">
            <p className="title is-5">
              <strong>{ newestDate } by { this.getUserName() }</strong>
              <br />
            </p>
          </div>
          <div className="column is-2 has-text-right">
            <i className="fa fa-lg fa-edit title is-5" onClick={() => this.enableEdit()} />
            <i className="fa fa-lg fa-trash-o title is-5" onClick={() => this.toggleDeleteMode()} />
          </div>
        </div >
        <div className="columns">
          <div className="column">
            {
              this.state.editing ? (
                <div>
                  <form onSubmit={e => this.saveNote(e)}>
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <textarea value={this.state.noteMessage} onChange={e => this.setState({ noteMessage: e.target.value })} className='textarea' />
                        </div>
                      </div>
                    </div>
                    <div className="columns">
                      <div className="column is-6">
                        <button type='submit' className={classNames('button', 'is-primary', 'column', 'is-12', { 'is-loading': this.state.editLoading })}>
                          Save
                        </button>
                      </div>
                      <div className="column is-6">
                        {
                          !this.state.editLoading ? (
                            <button className='button column is-12' onClick={() => this.cancelEdit()}>
                              Cancel
                            </button>
                          ) : null
                        }
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <p className="subtitle is-6">
                    { this.state.noteMessage }
                  </p>
                </div>
              )
            }
            {
              this.state.pendingDelete ? (
                <div>
                  <div className="columns">
                    <div className="column has-text-centered">
                      <strong>Are you sure you want to delete this note?</strong>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-4 is-offset-4">
                      <button className={classNames('button', 'is-danger', 'column', 'is-12', { 'is-loading': this.state.deleteLoading })} onClick={() => this.confirmDeleteNote()}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
          <div className="clearfix"></div>
        </div>
        <hr />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalNote)
