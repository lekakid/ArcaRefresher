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
  waitKeyInput: undefined,
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
    $resetKeyMap(state) {
      state.storage.keyTable = [];
    },
    setWaitKeyInput(state, action) {
      state.waitKeyInput = action.payload;
    },
  },
});

export const {
  $toggleEnabled,
  $toggleCompatibilityMode,
  $setKey,
  $resetKeyMap,
  setWaitKeyInput,
} = slice.actions;

export default slice.reducer;
