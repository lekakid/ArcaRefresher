import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import info from './info';

const defaultStorage = {
  blockAll: false,
  blockDeleted: true,
  blockReported: true,
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $toggleBlockAll(state) {
      state.storage.blockAll = !state.storage.blockAll;
    },
    $toggleBlockDeleted(state) {
      state.storage.blockDeleted = !state.storage.blockDeleted;
    },
    $toggleBlockReported(state) {
      state.storage.blockReported = !state.storage.blockReported;
    },
  },
});

export const { $toggleBlockAll, $toggleBlockDeleted, $toggleBlockReported } =
  slice.actions;

export default slice.reducer;
