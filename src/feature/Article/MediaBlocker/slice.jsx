import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  deletedOnly: true,
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
    $toggleDeletedOnly(state) {
      state.storage.deletedOnly = !state.storage.deletedOnly;
    },
  },
});

export const { $toggleEnabled, $toggleDeletedOnly } = slice.actions;

export default slice.reducer;
