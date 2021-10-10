'use strict'

const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  width: 500,
  height: 800,
  show: false,
  
  // update for electron V5+
  webPreferences: {
    nodeIntegration: true
  }
}

class Window extends BrowserWindow {
  constructor ({ file, query, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    if(typeof query !== "undefined"){
    this.loadFile(file, {query: {"name": query.name, "desc": query.desc}})
    }
    else {this.loadFile(file)}

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = {Window: Window}