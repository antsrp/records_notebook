'use strict'

const Store = require('electron-store')

class DataStore extends Store {
  constructor (settings) {
    super(settings)

    // initialize with notes or empty array
    this.notes = this.get('notes') || []
  }

  saveNotes () {
    // save notes to JSON file
    this.set('notes', this.notes)

    // returning 'this' allows method chaining
    return this
  }

  getNotes () {
    // set object's notes to notes in JSON file
    this.notes = this.get('notes') || []

    return this
  }

  addNote (note) {
    // merge the existing notes with the new note
    this.notes = [ ...this.notes, note ]

    //return this.saveNotes()
    return this
  }

  deleteNote (note) {
    // filter out the target node
    this.notes = this.notes.filter(function(value, index, arr){
      return value.name != note.name && value.desc != note.desc
    })
    return this

    //return this.saveNotes()
  }

  deleteNoteByIndex(index){
    this.notes = this.notes.filter(function(value, ind, arr){
      return ind != index
    })
    return this
  }

  editNote(noteNew, index){
    this.notes[index].name = noteNew.name
    this.notes[index].desc = noteNew.desc

    //return this.saveNotes()
    return this
  }
}

module.exports = {DataStore: DataStore}