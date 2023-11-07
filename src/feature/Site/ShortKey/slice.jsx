import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  keyTable: [
    { action: 'write', key: 'KeyW' },
    { action: 'refresh', key: 'KeyR' },
    { action: 'moveTop', key: 'KeyT' },
    { action: 'prev', key: 'KeyA' },
    { action: 'next', key: 'KeyS' },
    { action: 'goBoard', key: 'KeyQ' },
    { action: 'goBest', key: 'KeyE' },
    { action: 'comment', key: 'KeyC' },
    { action: 'recommend', key: 'KeyF' },
    { action: 'scrap', key: 'KeyV' },
  ],
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
      state.storage.keyTable = state.storage.keyTable.map((t) =>
        t.action === updatedAction ? { action: t.action, key: updatedKey } : t,
      );
    },
    $resetKeyMap(state) {
      state.storage.keyTable = defaultStorage.keyTable;
    },
    setWaitKeyInput(state, action) {
      state.waitKeyInput = action.payload;
    },
  },
});

export const { $toggleEnabled, $setKey, $resetKeyMap, setWaitKeyInput } =
  slice.actions;

export default slice.reducer;
