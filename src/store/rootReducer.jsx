import { combineReducers } from '@reduxjs/toolkit';

// path: '/src/core/{FeatureName}/slice.jsx'
const coreModules = import.meta.glob(['/src/core/*/slice.jsx'], {
  eager: true,
  import: 'default',
});
const coreReducerEntries = Object.values(coreModules);

// path: '/src/feature/{GroupName}/{FeatureName}/slice.jsx'
const featureModules = import.meta.glob(
  ['/src/feature/*/*/slice.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const featureReducerEntries = Object.values(featureModules);

const reducers = Object.fromEntries([
  ...coreReducerEntries,
  ...featureReducerEntries,
]);

export default combineReducers(reducers);
