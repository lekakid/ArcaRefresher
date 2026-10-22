import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware } from 'store/storage';

const coreModules = import.meta.glob(['/src/core/*/slice.jsx'], {
  eager: true,
  import: 'default',
});
const coreReducerEntries = Object.entries(coreModules).map(
  // path: '/src/core/{FeatureName}/slice.jsx'
  ([path, reducer]) => [path.split('/')[3], reducer],
);

const featureModules = import.meta.glob(
  ['/src/feature/*/*/slice.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const featureReducerEntries = Object.entries(featureModules).map(
  // path: '/src/feature/{GroupName}/{FeatureName}/slice.jsx'
  ([path, reducer]) => [path.split('/')[4], reducer],
);

const store = configureStore({
  reducer: Object.fromEntries([
    ...coreReducerEntries,
    ...featureReducerEntries,
  ]),
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(createMonkeySyncMiddleware()),
});

export default store;
