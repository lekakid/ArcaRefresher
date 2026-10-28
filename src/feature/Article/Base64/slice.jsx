import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import info from './info';

const defaultStorage = {
  version: 0,
  enabled: false,
  autoDecode: true,
  clipboardDecode: true,
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
  temporaryDisabled: false,
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $toggleAutoDecode(state) {
      state.storage.autoDecode = !state.storage.autoDecode;
    },
    $toggleClipboardDecode(state) {
      state.storage.clipboardDecode = !state.storage.clipboardDecode;
    },
    toggleTemporaryDisabled(state) {
      state.temporaryDisabled = !state.temporaryDisabled;
    },
  },
});

export const {
  $toggleEnabled,
  $toggleAutoDecode,
  $toggleClipboardDecode,
  toggleTemporaryDisabled,
} = slice.actions;

export default slice.reducer;
