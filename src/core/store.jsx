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
  /^feature\/(?!_).+\/slice$/,
);

const utilContext = require.context('util/', true, /^util\/(?!_).+\/slice$/);

const menuReducer = menuContext
  .keys()
  .reduce(
    (acc, cur) => ({ ...acc, [cur.split('/')[1]]: menuContext(cur).default }),
    {},
  );

const featureReducer = featureContext.keys().reduce(
  (acc, cur) => ({
    ...acc,
    [cur.split('/')[1]]: featureContext(cur).default,
  }),
  {},
);

const utilReducer = utilContext
  .keys()
  .reduce(
    (acc, cur) => ({ ...acc, [cur.split('/')[1]]: utilContext(cur).default }),
    {},
  );

const store = configureStore({
  reducer: {
    ...menuReducer,
    ...featureReducer,
    ...utilReducer,
  },
  middleware: [
    createStateSyncMiddleware({
      predicate: (action) => action.type.indexOf('/$') > -1,
    }),
  ],
});

store.subscribe(() => {
  Object.entries(store.getState())
    .filter(([, value]) => !!value.storage)
    .map(([key, value]) => setValue(key, value.storage));
});

initMessageListener(store);

export default store;
