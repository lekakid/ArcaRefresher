import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  countdown: 5,
  showProgress: true,
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.countdown = action.payload;
      setValue(MODULE_ID, state);
    },
    toggleAnimation(state) {
      state.showProgress = !state.showProgress;
      setValue(MODULE_ID, state);
    },
  },
});

export const { setTimeLimit, toggleAnimation } = slice.actions;

export default slice.reducer;
