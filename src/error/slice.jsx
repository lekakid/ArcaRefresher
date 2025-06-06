import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';

export const SLICE_ID = '__error_handler__';

const defaultStorage = {
  lastCheckVersion: {},
};

const initialState = {
  storage: getValue(SLICE_ID, defaultStorage),
};

export const slice = createSlice({
  name: SLICE_ID,
  initialState,
  reducers: {
    $setIgnoreVersionTarget(state, action) {
      const { moduleId, version } = action.payload;

      state.storage.lastCheckVersion[moduleId] = version;
    },
  },
});

export const { $setIgnoreVersionTarget, $setNotiLevel } = slice.actions;

export const ErrorHandlerEntires = [SLICE_ID, slice.reducer];
