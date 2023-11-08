import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  keyTable: [],
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
  waitKeyInput: undefined,
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
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

export const { $toggleEnabled, $setKey, $resetKeyMap, setWaitKeyInput } =
  slice.actions;

export default slice.reducer;
