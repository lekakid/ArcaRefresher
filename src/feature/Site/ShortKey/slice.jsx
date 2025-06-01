import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  compatibilityMode: false,
  keyTable: [],
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $toggleCompatibilityMode(state) {
      state.storage.compatibilityMode = !state.storage.compatibilityMode;
    },
    $setKey(state, action) {
      const { action: updatedAction, key: updatedKey } = action.payload;
      const exist = state.storage.keyTable.findIndex(
        (t) => t.action === updatedAction,
      );
      if (exist > -1) {
        state.storage.keyTable[exist].key = updatedKey;
        return;
      }
      state.storage.keyTable.push(action.payload);
    },
    $resetKey(state, action) {
      const { action: updatedAction } = action.payload;
      const exist = state.storage.keyTable.findIndex(
        (t) => t.action === updatedAction,
      );
      if (exist > -1) {
        state.storage.keyTable.splice(exist, 1);
      }
    },
    $resetKeyMap(state) {
      state.storage.keyTable = [];
    },
  },
});

export const {
  $toggleEnabled,
  $toggleCompatibilityMode,
  $setKey,
  $resetKey,
  $resetKeyMap,
} = slice.actions;

export default slice.reducer;
