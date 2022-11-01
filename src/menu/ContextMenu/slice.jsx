import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  // r: right click
  // sr: shift + right click
  // cr: ctrl + right click
  interactionType: 'r',
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
  open: false,
  snackBag: [],
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setInteraction(state, action) {
      state.storage.interactionType = action.payload;
    },
    setMenuOpen(state, action) {
      state.open = action.payload;
    },
    pushSnack(state, action) {
      state.snackBag.push(action.payload);
    },
    shiftSnack(state) {
      state.snackBag.shift();
    },
  },
});

export const { $setInteraction, setMenuOpen, pushSnack, shiftSnack } =
  slice.actions;

export default slice.reducer;
