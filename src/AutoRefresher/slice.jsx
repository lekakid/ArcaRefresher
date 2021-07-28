import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const REFRESH_TIME = { key: 'refreshTime', defaultValue: 5 };
const SHOW_PROGRESS = { key: 'showProgress', defaultValue: true };

const initialState = {
  timeLimit: getValue(REFRESH_TIME),
  showProgress: getValue(SHOW_PROGRESS),
};

export const autoRefresherSlice = createSlice({
  name: 'AutoRefresher',
  initialState,
  reducers: {
    setTimeLimit(state, action) {
      state.timeLimit = action.payload;
      setValue(REFRESH_TIME, action.payload);
    },
    setAnimation(state, action) {
      state.showProgress = action.payload;
      setValue(SHOW_PROGRESS, action.payload);
    },
  },
});

export const { setTimeLimit, setAnimation } = autoRefresherSlice.actions;

export default autoRefresherSlice.reducer;
