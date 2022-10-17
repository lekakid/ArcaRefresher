import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  countdown: 5,
  showProgress: true,
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.config.countdown = action.payload;
    },
    toggleAnimation(state) {
      state.config.showProgress = !state.config.showProgress;
    },
  },
});

export const { setTimeLimit, toggleAnimation } = slice.actions;

export default slice.reducer;
