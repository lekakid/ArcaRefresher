export default {
  name: 'Arca Refresher (Dev)',
  namespace: 'LeKAKiD',
  author: 'LeKAKiD',
  description: 'Arca Live Extension',
  icon: 'https://github.com/lekakid/ArcaRefresher/blob/develop/icon.png?raw=true',
  homepageURL: 'https://github.com/lekakid/ArcaRefresher',
  supportURL: 'https://arca.live/b/namurefresher',
  match: ['https://*.arca.live/*'],
  exclude: ['https://*.arca.live/api/*'],
  connect: ['namu.la', 'arca.live', 'saucenao.com', 'iqdb.org', 'ascii2d.net'],
  noframes: true,
  'run-at': 'document-body',
};
