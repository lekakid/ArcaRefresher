import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  countdown: 5,
  showProgress: true,
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.countdown = action.payload;
      setValue(Info.ID, state);
    },
    toggleAnimation(state) {
      state.showProgress = !state.showProgress;
      setValue(Info.ID, state);
    },
  },
});

export const { setTimeLimit, toggleAnimation } = slice.actions;

export default slice.reducer;
