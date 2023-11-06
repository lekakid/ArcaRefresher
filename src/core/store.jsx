import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware, initMonkeySync } from 'core/storage';

const menuContext = require.context('menu/', true, /^menu\/.+\/slice$/);
const menuReducerEntries = menuContext
  .keys()
  // path: 'menu/{MenuName}/slice.jsx'
  .map((path) => [path.split('/')[1], menuContext(path).default]);

const featureContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/slice$/,
);
const featureReducerEntries = featureContext
  .keys()
  // path: 'feature/{GroupName}/{FeatureName}/slice.jsx'
  .map((path) => [path.split('/')[2], featureContext(path).default]);

const store = configureStore({
  reducer: Object.fromEntries([
    ...menuReducerEntries,
    ...featureReducerEntries,
  ]),
  middleware: [createMonkeySyncMiddleware()],
});

initMonkeySync(store);

export default store;
