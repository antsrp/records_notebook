const { ipcRenderer } = require('electron')
const { Note } = require('./entities/Note')

//const  i18n   = require('../configs/i18next.config')

//const file = require('../configs/default.config.json')

var $ = require('jquery')

/*function setByLocale(){
   $("#addb").text(i18n.t("Add"))
   $("#resetb").text(i18n.t("Reset"))
   $("#search-text").prop("placeholder", i18n.t("SearchPlaceholder"))
   $("#tname").text(i18n.t("Name"))
   $("#tdesc").text(i18n.t("Desc"))
} */

function setByLocale(data){
   $("#addb").text(data.Add)
   $("#resetb").text(data.Reset)
   $("#search-text").prop("placeholder", data.SearchPlaceholder)
   $("#tname").text(data.Name)
   $("#tdesc").text(data.Desc)
}

ipcRenderer.on('trans-reply', function(event, data){
 setByLocale(data)
  })

ipcRenderer.send('trans-request')


/*i18n.on('loaded', (loaded) => {
    console.log(i18n)
    i18n.changeLanguage(file.language);
    i18n.off('loaded');
  });
i18n.on('languageChanged', (lng) => {
       setByLocale()
    }); */

var wrapper = $("<div>");
var container = $("<span>");
var buttonAdd = $("<button>")
buttonAdd.prop("type", "button")
buttonAdd.addClass("btn btn-primary btn-sm bmarg");
buttonAdd.prop("id", "addb")
container.append(buttonAdd)
var buttonReset = $("<button>")
buttonReset.prop("type", "button")
buttonReset.addClass("btn btn-light btn-sm bmarg");
buttonReset.prop("id", "resetb")
var input = $("<input>")
input.addClass("form-control")
input.prop("type", "text")
input.prop("id", "search-text")
container.append(buttonReset)
container.append(input)

var table = $("<table>")
table.addClass("table table-striped")
table.prop("id", "info-table")
var thead = $("<thead>")
var tr = $("<tr>");
var th = $("<th>");
th.addClass("tname")
th.prop("id", "tname")
th.prop("data-order", "0")
var thd = $("<th>");
thd.addClass("tdesc")
thd.prop("id", "tdesc")
thd.prop("data-order", "0")
var tbody = $("<tbody>")
tbody.prop("id", "lul")
tr.append(th)
tr.append(thd)
thead.append(tr)
table.append(thead)
table.append(tbody)

wrapper.append(container)
wrapper.append(table)
$("body").append(wrapper)

let note;
let row;

// delete note by its text value ( used below in event listener)
const deleteNote = (e) => {
  let tr = (e.target.parentElement.parentElement).closest('tr')
  let cells = tr.cells // get tr from button delete clicker
  let name = cells[0].innerHTML
  let desc = cells[1].innerHTML
  //let note = new Note(name, desc)
  note = new Note(name, desc)
  row = tr.dataset.row

  ipcRenderer.send('sureToDel', note)
}

ipcRenderer.on('sure', (event, answer) =>{
    if(answer == true){
      ipcRenderer.send('delete-note', note, row)
    }
  }) 

const editNote = (e) =>{
  ipcRenderer.send('edit-note', e.target.textContent)
}


// create add note window button
document.getElementById('addb').addEventListener('click', () => {
  ipcRenderer.send('addNote')
}) 

document.getElementById('lul').addEventListener('dblclick', (e) => {
  let tr = e.target.closest('tr')
  let cells = tr.cells
  let name = cells[0].innerHTML
  let desc = cells[1].innerHTML
  let note = new Note(name, desc)
  ipcRenderer.send('editNote', note, tr.dataset.row)
});

ipcRenderer.on('editNotes', (event, noteNew, rIndex) => {
  const table = document.getElementById('lul')

  let index;

  for(var i=0; i<table.rows.length; i++){
    if(table.rows[i].dataset.row == rIndex)
    {
      index = i;
      break;
    }
  }
  let cells = table.rows[index].cells
  cells[0].innerHTML = noteNew.name
  cells[1].innerHTML = noteNew.desc
})

ipcRenderer.on('delNote', (event, rIndex) =>{
  const table = document.getElementById('lul')

  let index;
  for(var i=0; i<table.rows.length; i++){
    if(table.rows[i].dataset.row == rIndex)
    {
      index = i;
      break;
    }
  }

  table.deleteRow(index)

  for(var i=0; i<table.rows.length; i++){
    if(table.rows[i].dataset.row > rIndex){
    table.rows[i].dataset.row--
    }
  }
})

ipcRenderer.on('addNoteToTable', (event, note) =>{
  const table = document.getElementById('lul')
  var newRow = table.insertRow(0)
  var nameCell = newRow.insertCell(0)
  var descCell = newRow.insertCell(1)
  var delRowCell = newRow.insertCell(2)

  nameCell.innerHTML = note.name;
  descCell.innerHTML = note.desc;
  newRow.setAttribute("data-row", table.rows.length - 1)
  delRowCell.innerHTML = `<button class="btn btn-danger" id="rowremove">
      <span class="glyphicon glyphicon-remove"></span></button>`
  delRowCell.addEventListener('click', deleteNote)
})

//ipcRenderer.on('changeLang', (event, lng) =>{
//  i18n.changeLanguage(lng)
//})

  ipcRenderer.on('changeLang', (event, lng) =>{
  ipcRenderer.send('trans-request')
})

// on receive notes
ipcRenderer.on('notes', (event, notes) => {

  const table = document.getElementById('lul')
  // create html string

  notes.forEach(function(note, index){
    var newRow = table.insertRow(0)
      var nameCell = newRow.insertCell(0)
      var descCell = newRow.insertCell(1)
      var delRowCell = newRow.insertCell(2)

      nameCell.innerHTML = note.name;
      descCell.innerHTML = note.desc;
      delRowCell.innerHTML = `<button class="btn btn-danger" id="rowremove">
      <span class="glyphicon glyphicon-remove"></span></button>`
      newRow.setAttribute("data-row", index)
  })

  document.querySelectorAll('#rowremove').forEach(item =>{
    item.addEventListener('click', deleteNote)
  })
})  

$("#search-text").keyup(function(){
    var phrase = document.getElementById('search-text');
    var table = document.getElementById('info-table');
    var regPhrase = new RegExp(phrase.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
        }
});
