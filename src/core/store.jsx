import { configureStore } from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';

import { setValue } from 'core/storage';

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
  middleware: [
    createStateSyncMiddleware({
      channel: `AR_${GM_info.script.version}`,
      predicate: (action) => action.type.indexOf('/$') > -1,
    }),
  ],
});

let isSync = true;
function disableStorage() {
  isSync = false;
}

let prevState = store.getState();
store.subscribe(() => {
  if (!isSync) return;

  const currentState = store.getState();

  Object.entries(currentState)
    .filter(([, value]) => !!value.storage)
    .forEach(([key, value]) => {
      if (prevState[key].storage !== value.storage)
        setValue(key, value.storage);
    });

  prevState = currentState;
});

initMessageListener(store);

export default store;
export { disableStorage };
