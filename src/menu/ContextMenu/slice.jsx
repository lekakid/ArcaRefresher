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
  storage: getValue(Info.id, defaultStorage),
  mousePos: null,
  triggerList: [],
};

export const slice = createSlice({
  name: Info.id,
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
      const i = state.triggerList.findIndex((t) => t === action.payload);
      state.triggerList.splice(i, 1);
    },
  },
});

export const { $setInteraction, setOpen, addTrigger, removeTrigger } =
  slice.actions;

export default slice.reducer;
