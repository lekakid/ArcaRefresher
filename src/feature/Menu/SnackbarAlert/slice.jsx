import { createSlice } from '@reduxjs/toolkit';
import info from './info';

const initialState = {
  snackBag: [],
};

export const slice = createSlice({
  name: info.id,
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

export default [info.id, slice.reducer];
