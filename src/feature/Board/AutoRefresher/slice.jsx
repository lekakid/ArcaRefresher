import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  countdown: 5,
  maxTime: -1,
  refreshOnArticle: false,
  progressPos: 'bottom left',
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setTimeLimit(state, action) {
      state.storage.countdown = action.payload;
    },
    $setMaxTime(state, action) {
      state.storage.maxTime = action.payload;
    },
    $toggleRefreshOnArticle(state) {
      state.storage.refreshOnArticle = !state.storage.refreshOnArticle;
    },
    $setProgressPos(state, action) {
      state.storage.progressPos = action.payload;
    },
  },
});

export const {
  $setTimeLimit,
  $setMaxTime,
  $toggleRefreshOnArticle,
  $setProgressPos,
} = slice.actions;

export default slice.reducer;
