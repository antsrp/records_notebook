'use strict'

const { ipcRenderer } = require('electron')
const { Note } = require('./entities/Note')
const queryString = require('querystring');

var $ = require('jquery')

let parseQS = function (str) {

    if (typeof str != 'string') {
        return {};
    }

    if (str.indexOf('?') != -1) {
        str = str.split('?')[1];
    }

    if (str.indexOf('=') != -1) {
        return queryString.parse(str,'&','=',{maxKeys:3}); 
    }

    return {};
};

let answer = false

document.getElementById('yes').addEventListener('click', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  answer = true
  ipcRenderer.send('sdn', answer)

  window.close()

})

document.getElementById('no').addEventListener('click', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  ipcRenderer.send('sdn', answer)

  window.close()

})

ipcRenderer.on('trans-reply', function(event, data){
     let name = $("#nName")
    let desc = $("#nDesc")
    let hn = $("#hn")
    let yesb = $("#yes")
    let nob = $("#no")
    let query = parseQS(window.location.search)
    name.prop("placeholder", data.Name + "...")
    desc.prop("placeholder", data.Desc + "...")
    if(typeof query.name !== "undefined"){
    name.prop("value", query.name)
    desc.prop("value", query.desc)
    document.title = data.Delete + " " + data.Note
    hn.text(data.Sure)
    yesb.text(data.Yes)
    nob.text(data.No)
    }
})

ipcRenderer.send('trans-request')