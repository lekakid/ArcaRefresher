import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  position: 'beforeHead',
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $setPosition(state, action) {
      state.storage.position = action.payload;
    },
  },
});

export const { $setPosition } = slice.actions;

export default slice.reducer;
