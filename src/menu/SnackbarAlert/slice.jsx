import { createSlice } from '@reduxjs/toolkit';
import Info from './FeatureInfo';

const initialState = {
  snackBag: [],
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    pushSnack(state, action) {
      state.snackBag.push(action.payload);
    },
    shiftSnack(state) {
      state.snackBag.shift();
    },
  },
});

export const { pushSnack, shiftSnack } = slice.actions;

export default slice.reducer;
