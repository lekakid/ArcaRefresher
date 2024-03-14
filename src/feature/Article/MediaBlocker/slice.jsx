import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  blockAll: false,
  blockDeleted: true,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleBlockAll(state) {
      state.storage.blockAll = !state.storage.blockAll;
    },
    $toggleBlockDeleted(state) {
      state.storage.blockDeleted = !state.storage.blockDeleted;
    },
  },
});

export const { $toggleBlockAll, $toggleBlockDeleted } = slice.actions;

export default slice.reducer;
