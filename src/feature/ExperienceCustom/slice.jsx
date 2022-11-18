import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  spoofTitle: '',
  openArticleNewWindow: false,
  blockMediaNewWindow: false,
  ignoreExternalLinkWarning: false,
  ratedownGuard: false,
  foldComment: false,
  wideClickArea: true,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $setSpoofTitle(state, action) {
      state.storage.spoofTitle = action.payload;
    },
    $toggleArticleNewWindow(state) {
      state.storage.openArticleNewWindow = !state.storage.openArticleNewWindow;
    },
    $toggleBlockMediaNewWindow(state) {
      state.storage.blockMediaNewWindow = !state.storage.blockMediaNewWindow;
    },
    $toggleIgnoreExternalLinkWarning(state) {
      state.storage.ignoreExternalLinkWarning =
        !state.storage.ignoreExternalLinkWarning;
    },
    $toggleRateDownGuard(state) {
      state.storage.ratedownGuard = !state.storage.ratedownGuard;
    },
    $toggleComment(state) {
      state.storage.foldComment = !state.storage.foldComment;
    },
    $toggleWideArea(state) {
      state.storage.wideClickArea = !state.storage.wideClickArea;
    },
  },
});

export const {
  $setSpoofTitle,
  $toggleArticleNewWindow,
  $toggleBlockMediaNewWindow,
  $toggleIgnoreExternalLinkWarning,
  $toggleRateDownGuard,
  $toggleComment,
  $toggleWideArea,
} = slice.actions;

export default slice.reducer;
