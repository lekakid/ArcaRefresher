import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  contextMenuEnabled: true,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleContextMenu(state) {
      state.storage.contextMenuEnabled = !state.storage.contextMenuEnabled;
    },
  },
});

export const { $toggleContextMenu } = slice.actions;

export default slice.reducer;
