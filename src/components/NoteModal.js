import React, { Component } from 'react'
import classNames from 'classnames'
import { map } from 'lodash'
import makeCancelable from 'makecancelable'
import { connect } from 'react-redux'

import { toastr } from 'Helpers'

import ModalNote from './ModalNote'
import { dispatchAddNote } from '@/store/reducers/notes'

import styles from './styles/NoteModal.scss'

const mapDispatchToProps = dispatch => ({
  addNote: noteData => dispatchAddNote(dispatch, noteData),
})

class NoteModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      noteMessage: '',
      loading: false
    }
  }

  hide = () => {
    if (this.props.onHideModal) {
      this.props.onHideModal()
    }
  }

  saveNote = e => {
    e.preventDefault()

    this.setState({
      loading: true
    })

    const noteData = {
      entry: this.props.task.id,
      message: this.state.noteMessage
    }

    this.cancelSaveNote = makeCancelable(
      this.props.addNote(noteData),
      () => {
        this.setState({
          loading: false,
          noteMessage: ''
        })
      },
      () => {
        this.setState({
          loading: false
        })

        toastr.error('There was an error while submitting your request', 'Error')
      }
    )
  }

  render() {
    return (
      <div className={classNames('modal', { 'is-active': this.props.modalVisible }, styles.NoteModal)}>
        <div className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">
              Notes for '{ this.props.task.description }'
            </p>
            <button className="delete" onClick={() => this.hide()} />
          </header>
          <section className="modal-card-body">
            <div>
              <form onSubmit={e => this.saveNote(e)}>
                <div className="field">
                  <label className="label">Message</label>
                  <textarea className="textarea" value={this.state.noteMessage} onChange={e => this.setState({ noteMessage: e.target.value })} />
                </div>
                <button type="submit" className={classNames('button', 'is-primary', 'is-block', { 'is-loading': this.state.loading })}>
                  Save Note
                </button>
              </form>
            </div>
            <hr />
            {
              this.props.notes.length ? (
                <div>
                  {
                    map(this.props.notes, note => (
                      <ModalNote note={note} key={note.id} />
                    ))
                  }
                </div>
              ) : (
                <div>
                  <h3 className="title is-4">
                    This task doesn't have any notes yet.
                  </h3>
                </div>
              )
            }
          </section>
          <footer className="modal-card-foot">
            <button className="button is-pulled-right" onClick={() => this.hide()}>
              Close
            </button>
          </footer>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(NoteModal)
