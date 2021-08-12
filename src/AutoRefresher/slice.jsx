import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

const REFRESH_TIME = { key: 'refreshTime', defaultValue: 5 };
const SHOW_PROGRESS = { key: 'showProgress', defaultValue: true };

const initialState = {
  timeLimit: getValue(REFRESH_TIME),
  showProgress: getValue(SHOW_PROGRESS),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.timeLimit = action.payload;
      setValue(REFRESH_TIME, action.payload);
    },
    toggleAnimation(state) {
      state.showProgress = !state.showProgress;
      setValue(SHOW_PROGRESS, state.showProgress);
    },
  },
});

export const { setTimeLimit, toggleAnimation } = slice.actions;

export default slice.reducer;