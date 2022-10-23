import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  countdown: 5,
  showProgress: true,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setTimeLimit(state, action) {
      state.storage.countdown = action.payload;
    },
    $toggleAnimation(state) {
      state.storage.showProgress = !state.storage.showProgress;
    },
  },
});

export const { $setTimeLimit, $toggleAnimation } = slice.actions;

export default slice.reducer;
