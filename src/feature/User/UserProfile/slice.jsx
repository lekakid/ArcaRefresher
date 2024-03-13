import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import { FOREGROUND } from 'func/window';
import Info from './FeatureInfo';

const defaultStorage = {
  contextRange: 'nickname',
  openType: FOREGROUND,
  indicateMyComment: false,
  showId: false,
  checkSpamAccount: false,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
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
    $toggleCheckSpamAccount(state) {
      state.storage.checkSpamAccount = !state.storage.checkSpamAccount;
    },
  },
});

export const {
  $setContextRange,
  $setOpenType,
  $toggleIndicateMyComment,
  $toggleIdVisible,
  $toggleCheckSpamAccount,
} = slice.actions;

export default slice.reducer;
