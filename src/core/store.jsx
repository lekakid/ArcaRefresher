import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware, initMonkeySync } from 'core/storage';
import { ContentReducerEntrie } from 'hooks/Content';
import { LoadCheckerReducerEntrie } from 'hooks/LoadChecker';

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
    LoadCheckerReducerEntrie,
    ContentReducerEntrie,
    ...menuReducerEntries,
    ...featureReducerEntries,
  ]),
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(createMonkeySyncMiddleware()),
});

initMonkeySync(store);

export default store;
