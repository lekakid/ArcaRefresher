import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'store/storage';
import info from './info';

const defaultStorage = {
  position: 'beforeHead',
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $setPosition(state, action) {
      state.storage.position = action.payload;
    },
  },
});

export const { $setPosition } = slice.actions;

export default [info.id, slice.reducer];
