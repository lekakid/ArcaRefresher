import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  countdown: 5,
  showProgress: true,
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.countdown = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    toggleAnimation(state) {
      state.showProgress = !state.showProgress;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const { setTimeLimit, toggleAnimation } = slice.actions;

export default slice.reducer;
