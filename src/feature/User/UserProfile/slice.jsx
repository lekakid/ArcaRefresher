import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import { FOREGROUND } from 'func/window';
import Info from './FeatureInfo';

const defaultStorage = {
  contextRange: 'articleItem',
  openType: FOREGROUND,
  indicateMyComment: false,
  showId: false,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setContextRange(state, action) {
      state.storage.contextRange = action.payload;
    },
    $setOpenType(state, action) {
      state.storage.openType = action.payload;
    },
    $toggleIndicateMyComment(state) {
      state.storage.indicateMyComment = !state.storage.indicateMyComment;
    },
    $toggleIdVisible(state) {
      state.storage.showId = !state.storage.showId;
    },
  },
});

export const {
  $setContextRange,
  $setOpenType,
  $toggleIndicateMyComment,
  $toggleIdVisible,
} = slice.actions;

export default slice.reducer;
