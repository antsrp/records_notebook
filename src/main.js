'use strict'

const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { Note } = require('./entities/Note');
const { Window } = require('./entities/Window');
const { DataStore } = require('./entities/DataStore');
const { DoState } = require('./entities/DoState');
const  i18n   = require('../configs/i18next.config')
const menuFactoryService = require('./services/menuFactory');
//const defConfig = require('./configs/default.config')

//require('electron-reload')(__dirname);
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron.cmd')
}) 

const fs = require('fs');
const notesData = new DataStore({ name: 'Notes Main' })
//console.log(notesData.notes)

const fileName = './configs/default.config.json'
const file = require("../" + fileName)

var reserveData;

let mainWindow;
let addNoteWin;
let rowIndexToEdit = -1; // to edit

const ds = new DoState()

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

  let changeDoState = () => {
    if(reserveData != ""){
      ds.addUnDo(reserveData)
    } else{
      mainWindow.send('reset')
    }
    if(!ds.undoIsEmpty()){
      //menu.getMenuItemById('undo').enabled = true
      menuFactoryService.menu.getMenuItemById('undo').enabled = true
    }else{
     // menu.getMenuItemById('undo').enabled = false
     menuFactoryService.menu.getMenuItemById('undo').enabled = false
    }
    if(!ds.redoIsEmpty()){
      //menu.getMenuItemById('redo').enabled = true
      menuFactoryService.menu.getMenuItemById('redo').enabled = true
    }else{
      //menu.getMenuItemById('redo').enabled = false
      menuFactoryService.menu.getMenuItemById('redo').enabled = false
    }
  }

  class Watcher{
    constructor(){}
    ReDoClick(){
      //console.log("redo SIGNAL")
     reserveData = "";
     notesData.notes = clone(ds.redo(notesData.notes));
     //console.log(notesData.notes)
     changeDoState()
    }
    UnDoClick(){
      // console.log("undo SIGNAL")
     reserveData = "";
     notesData.notes = clone(ds.undo(notesData.notes));
     //console.log(notesData.notes)
     changeDoState()
    }
  }
  
  // create add note window
  ipcMain.on('addNote', () => {
  
    if (!addNoteWin) {
      
      addNoteWin = new Window({
        file: 'src/edit.html',
        width: 250,
        height: 300,
      //width: 800, 
      //height: 800,
        autoHideMenuBar: true,
        parent: mainWindow
      })

      //addNoteWin.openDevTools();
      // cleanup
      addNoteWin.on('closed', () => {
        addNoteWin = null
      })
    }
  }) 

    ipcMain.on('editNote', (target, arg, rowIndex) => {
      
      let editNoteWin = new Window({
        file: 'src/edit.html',
        query: arg,
        width: 250,
        height: 300,
        //width: 800, 
        //height: 800,
        parent: mainWindow,
        autoHideMenuBar: true,
        modal: true
        /*,
       webPreferences: {
      preload: path.resolve(__dirname, 'editPreload.js')
        }*/
      })

      rowIndexToEdit = rowIndex
      //editNoteWin.openDevTools();

      // cleanup
      editNoteWin.on('closed', () => {
        editNoteWin = null
      })
  }) 

     ipcMain.on('sureToDel', (target, arg) => {
      
      let editNoteWin = new Window({
        file: 'src/sureToDel.html',
        query: arg,
        width: 380,
        height: 380,
        //width: 800, 
        //height: 800,
        parent: mainWindow,
        autoHideMenuBar: true,
        modal: true/*,
       webPreferences: {
      preload: path.resolve(__dirname, 'editPreload.js')
        }*/
      })

      //editNoteWin.openDevTools();

      // cleanup
      editNoteWin.on('closed', () => {
        editNoteWin = null
      })
  }) 

  ipcMain.on('sdn', (event, ans) =>{
        mainWindow.send('sure', ans)
      })

  ipcMain.on('trans-request', function(event){
    let data = i18n.getDataByLanguage(i18n.language)
    event.sender.send('trans-reply', data.translation)
  })

  // add-note from add note window
  ipcMain.on('add-note', (event, note) => {
    reserveData = clone(notesData.notes)
    const updatednotes = notesData.addNote(note).notes
    changeDoState()

    mainWindow.send('addNoteToTable', note)
  }) 

  // delete-note from note list window
  ipcMain.on('delete-note', (event, note, rowIndex) => {
    reserveData = clone(notesData.notes)
    //const updatednotes = notesData.deleteNote(note).notes
    const updatednotes = notesData.deleteNoteByIndex(rowIndex).notes
    //console.log(notesData.notes)
    changeDoState()

    mainWindow.send('delNote', rowIndex)
  }) 

  // edit-note from edit note window
  ipcMain.on('edit-note', (event, noteNew) => {
    reserveData = clone(notesData.notes)
    const updatednotes = notesData.editNote(noteNew, rowIndexToEdit).notes
    changeDoState()
 
    mainWindow.send('editNotes', noteNew, rowIndexToEdit)
    rowIndexToEdit = -1
  }) 

  ipcMain.on('redrow', (event) =>{
    mainWindow.webContents.send('notes', notesData.notes)
  })

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 1000, height: 625, show: false, webPreferences: {
            nodeIntegration: true
        } });
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    if(file.language != i18n.language){
      file.language = i18n.language
      let json = JSON.stringify(file, null, 2)
      console.log(json)
      fs.writeFile(fileName, json, function writeJSON(err) {
      if (err) return console.log(err);
    });
    }
    notesData.saveNotes()
    mainWindow = null;
  });

  //Menu.setApplicationMenu(menu)
  mainWindow.openDevTools();
   mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.send('notes', notesData.notes)
    mainWindow.show()
})

   i18n.on('loaded', (loaded) => {
    i18n.changeLanguage(file.language);
    i18n.off('loaded');
  });
  i18n.on('languageChanged', (lng) => {
      var watcher = new Watcher();
      menuFactoryService.buildMenu(app, mainWindow, watcher, i18n);
      mainWindow.send('changeLang', lng);
    });

});

