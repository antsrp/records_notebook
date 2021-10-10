const Menu = require('electron').Menu;
const config = require('../../configs/app.config');
const darwinTemplate = require('../menus/darwinMenu');
const otherTemplate = require('../menus/otherMenu');
const menu = null;
const platform = process.platform;
function MenuFactoryService(menu) {
  this.menu = menu;
  this.buildMenu = buildMenu;
}
function buildMenu(app, mainWindow, watcher, i18n) {
  if (config.platform === 'darwin') {
    this.menu = Menu.buildFromTemplate(darwinTemplate(app, watcher, i18n));
    Menu.setApplicationMenu(this.menu);
  } else {
    this.menu = Menu.buildFromTemplate(otherTemplate(app, watcher, i18n));
    mainWindow.setMenu(this.menu)
  }
}
module.exports = new MenuFactoryService(menu);