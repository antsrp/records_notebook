var $ = require('jquery');

function tableSearch() {
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
}

function reset(){
   var table = document.getElementById('lul')
    while(table.rows.length != 0){
    table.deleteRow(0)
   }
   document.querySelectorAll('#info-table thead th').forEach(
    tableTH => {
        tableTH.classList.remove('sorted')
        tableTH.dataset.order = 0
    })
   ipcRenderer.send('redrow')
}

ipcRenderer.on('reset', () => {
    reset()
})

 const getSort = ({ target }) => {
        let order
        if(target.dataset.order == 0){
        order = 1
        target.dataset.order = 1
        } else{
            order = (target.dataset.order = -(target.dataset.order || -1));
        }
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

     /*   for(const tBody of target.closest('table').tBodies)
        console.log([...tBody.rows].sort(comparator(index, order))) */
        
        for(const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for(const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target); 
    };

document.getElementById('resetb').addEventListener('click', reset) 

document.querySelectorAll('#info-table thead').forEach(
    tableTH => tableTH.addEventListener('click', () => getSort(event))); 

