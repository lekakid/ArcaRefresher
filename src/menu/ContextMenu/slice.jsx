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
  snack: false,
  snackMsg: '',
  snackTime: null,
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
    setContextSnack(state, action) {
      const { open, msg, time } = action.payload;
      state.snack = open;
      if (open) {
        state.snackMsg = msg || '';
        state.snackTime = time;
      }
    },
  },
});

export const { $setInteraction, setMenuOpen, setContextSnack } = slice.actions;

export default slice.reducer;
