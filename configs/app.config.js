module.exports = {
  platform: process.platform,
  port: process.env.PORT ? process.env.PORT : 3000,
  title: 'Notebook',
  languages: ['en', 'ru'],
  fallbackLng: 'en',
  namespace: 'translation'
};