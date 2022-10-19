import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  openArticleNewWindow: false,
  blockMediaNewWindow: false,
  ratedownGuard: false,
  foldComment: false,
  wideClickArea: true,
};

const initialState = {
  storage: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleArticleNewWindow(state) {
      state.storage.openArticleNewWindow = !state.storage.openArticleNewWindow;
    },
    toggleHideFirstImage(state) {
      state.storage.hideFirstImage = !state.storage.hideFirstImage;
    },
    toggleBlockMediaNewWindow(state) {
      state.storage.blockMediaNewWindow = !state.storage.blockMediaNewWindow;
    },
    toggleBlockDeletedArticleMedia(state) {
      state.storage.blockDeletedArticleMedia =
        !state.storage.blockDeletedArticleMedia;
    },
    toggleRateDownGuard(state) {
      state.storage.ratedownGuard = !state.storage.ratedownGuard;
    },
    toggleComment(state) {
      state.storage.foldComment = !state.storage.foldComment;
    },
    toggleWideArea(state) {
      state.storage.wideClickArea = !state.storage.wideClickArea;
    },
  },
});

export const {
  toggleArticleNewWindow,
  toggleBlockMediaNewWindow,
  toggleHideDeletedArticleMedia,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} = slice.actions;

export default slice.reducer;
