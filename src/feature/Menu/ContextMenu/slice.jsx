import { createSlice, original } from '@reduxjs/toolkit';
import { getValue } from 'store/storage';
import info from './info';

const defaultStorage = {
  // r: right click
  // sr: shift + right click
  // cr: ctrl + right click
  interactionType: 'r',
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
  mousePos: null,
  triggerList: [],
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $setInteraction(state, action) {
      state.storage.interactionType = action.payload;
    },
    setOpen(state, action) {
      state.mousePos = action.payload;
    },
    addTrigger(state, action) {
      state.triggerList.push(action.payload);
    },
    removeTrigger(state, action) {
      const i = original(state.triggerList).indexOf(action.payload);
      if (i !== -1) state.triggerList.splice(i, 1);
    },
  },
});

export const { $setInteraction, setOpen, addTrigger, removeTrigger } =
  slice.actions;

export default slice.reducer;
