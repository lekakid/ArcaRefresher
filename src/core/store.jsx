import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware, initMonkeySync } from 'core/storage';

const menuContext = require.context('menu/', true, /^menu\/(?!_).+\/slice$/);

const featureContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/.+\/slice$/,
);

const menuReducerEntries = menuContext
  .keys()
  .map((path) => [path.split('/')[1], menuContext(path).default]);

const featureReducerEntries = featureContext
  .keys()
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
