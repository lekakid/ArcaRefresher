import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware, initMonkeySync } from 'core/storage';
import { ErrorHandlerEntires } from 'error/slice';
import { ContentReducerEntrie } from 'hooks/Content';
import { LoadCheckerReducerEntrie } from 'hooks/LoadChecker';

const menuModules = import.meta.glob('/src/menu/*/slice.jsx', {
  eager: true,
  import: 'default',
});
const menuReducerEntries = Object.entries(menuModules).map(
  // path: '/src/menu/{MenuName}/slice.jsx'
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
    ErrorHandlerEntires,
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
