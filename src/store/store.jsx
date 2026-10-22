import { configureStore } from '@reduxjs/toolkit';

import { createMonkeySyncMiddleware } from 'store/storage';
import { ErrorHandlerEntires } from 'error/slice';
import { ContentReducerEntries } from 'hooks/Content';
import { LoadCheckerReducerEntries } from 'hooks/LoadChecker';

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
    LoadCheckerReducerEntries,
    ContentReducerEntries,
    ...featureReducerEntries,
  ]),
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(createMonkeySyncMiddleware()),
});

export default store;
