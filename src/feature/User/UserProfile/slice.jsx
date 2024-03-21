import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import { FOREGROUND } from 'func/window';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  // 모양
  avatar: true,
  showId: false,
  indicateMyComment: false,
  // 우클릭
  contextRange: 'nickname',
  openType: FOREGROUND,
  checkSpamAccount: false,
};

const initialState = {
  storage: getValue(Info.id, defaultStorage),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleAvatar(state) {
      state.storage.avatar = !state.storage.avatar;
    },
    $toggleIdVisible(state) {
      state.storage.showId = !state.storage.showId;
    },
    $toggleIndicateMyComment(state) {
      state.storage.indicateMyComment = !state.storage.indicateMyComment;
    },
    $setContextRange(state, action) {
      state.storage.contextRange = action.payload;
    },
    $setOpenType(state, action) {
      state.storage.openType = action.payload;
    },
    $toggleCheckSpamAccount(state) {
      state.storage.checkSpamAccount = !state.storage.checkSpamAccount;
    },
  },
});

export const {
  $toggleAvatar,
  $toggleIdVisible,
  $toggleIndicateMyComment,
  $setContextRange,
  $setOpenType,
  $toggleCheckSpamAccount,
} = slice.actions;

export default slice.reducer;
