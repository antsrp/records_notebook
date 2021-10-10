class DoState{
  maxvalue = 5;
  constructor(){
    this.red = []
    this.und = []
  }
  addReDo(obj){
		if(this.red.length === this.maxvalue){
			this.red.pop();
		}
		this.red.push(obj);
	}
	addUnDo(obj){
		if(this.und.length === this.maxvalue){
			this.und.pop();
		}
		this.und.push(obj);
	}
	redo(obj){
    if(this.red.length !== 0){
		var un = this.red.pop();
    this.addUnDo(obj);
    return un;
    }
	}
	undo(obj){
    if(this.und.length !== 0){
    var re = this.und.pop();
    this.addReDo(obj);
    return re;
    }
	}
  get getRedo(){
    return this.red;
  }
  get getUndo(){
    return this.und;
  }
  redoIsEmpty(){
  	return this.red.length === 0;
  }
  undoIsEmpty(){
  	return this.und.length === 0;
  }
}

module.exports = {DoState: DoState}

/*var ds = new DoState();

ds.addUnDo(2);
ds.addUnDo(3);
ds.addUnDo(4);
ds.undo();
ds.undo();

console.log(ds.maxvalue)
console.log(ds.getUndo)
console.log(ds.getRedo) */
