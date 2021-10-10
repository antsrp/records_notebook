const config = require('../../configs/app.config');

module.exports = (app, watcher, i18n) => {
  let menu = [{
          "label": i18n.t("Edit"),
          "submenu": 
          [{
              "id": "undo",
              "label": i18n.t("Undo"),
              "accelerator": "CmdOrCtrl + z",
              "enabled": false,
              click: () => {
                watcher.UnDoClick()
              }
          }, {
              "id": "redo",
              "label": i18n.t("Redo"),
              "accelerator": "CmdOrCtrl + y",
              "enabled": false,
              click: () => {
                watcher.ReDoClick()
              }
          }]
        
  }]
  const languageMenu = config.languages.map((languageCode) => {
      return {
        label: i18n.t(languageCode),
        type: 'radio',
        checked: i18n.language === languageCode,
        click: () => {
          i18n.changeLanguage(languageCode);
        }
      }
  });
  menu.push({
    label: i18n.t('Language'),
    submenu: languageMenu
  });
  return menu;
}