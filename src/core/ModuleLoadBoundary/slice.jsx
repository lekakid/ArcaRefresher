import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'store/storage';

import info from './info';

const defaultStorage = {
  lastCheckVersion: {},
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $setIgnoreVersionTarget(state, action) {
      const { moduleId, version } = action.payload;

      state.storage.lastCheckVersion[moduleId] = version;
    },
  },
});

export const { $setIgnoreVersionTarget } = slice.actions;

export default [info.id, slice.reducer];
