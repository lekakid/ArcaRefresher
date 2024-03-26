import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 0,
  enabled: false,
  autoDecode: true,
  clipboardDecode: true,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
  temporaryDisabled: false,
};

export const slice = createSlice({
  name: Info.id,
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
