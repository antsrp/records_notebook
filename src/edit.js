'use strict'

const { ipcRenderer } = require('electron')
const { Note } = require('./entities/Note')
const queryString = require('querystring');

var $ = require('jquery')

let isEdit = false
let oldNote

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

ipcRenderer.on('trans-reply', function(event, data){
	 let name = $("#nName")
    let desc = $("#nDesc")
    let hn = $("#hn")
	let but = $("#but")
    let query = parseQS(window.location.search)
    name.prop("placeholder", data.Name + "...")
    desc.prop("placeholder", data.Desc + "...")
	if(typeof query.name !== "undefined"){
	name.prop("value", query.name)
	desc.prop("value", query.desc)
	isEdit = true
	oldNote = query
	document.title = data.Edit + " " + data.Note
	hn.text(data.Edit + " " + data.Note)
	but.text(data.Edit)
	}
	else{
	document.title = data.Add + " " + data.Note
	hn.text(data.Add + " " + data.Note)
	but.text(data.Add)
	but.addClass("btn-success")
	}
})

ipcRenderer.send('trans-request')

//let name = $("#nName")
//let desc = $("nDesc")
//let q = queryString.parse(window.location.search);
//console.log(q)
//let query = JSON.parse(q['note'])
//console.log(query)

/*
let name = document.querySelector("#nName")
	let desc = document.querySelector("#nDesc")
	let query = parseQS(window.location.search)
	if(typeof query.name !== "undefined"){
	name.value =  query.name
	desc.value = query.desc
	isEdit = true
	oldNote = query
	}
	else{
	let hn = document.getElementById("hn")
	let but = document.getElementById("but")
	document.title = "Добавить запись"
	hn.innerHTML = "Добавить запись"
	but.innerHTML = "Добавить"
	} */

document.getElementById('editForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  let note = new Note(evt.target[0].value, evt.target[1].value);
  if(!isEdit){
    ipcRenderer.send('add-note', note)
	}
  else {
  	if(oldNote.name != note.name || oldNote.desc != note.desc){
  	ipcRenderer.send('edit-note', note)
  	}
  	isEdit = false
  }

  window.close()
})
