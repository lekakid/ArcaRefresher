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
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleArticleNewWindow(state) {
      state.config.openArticleNewWindow = !state.config.openArticleNewWindow;
    },
    toggleHideFirstImage(state) {
      state.config.hideFirstImage = !state.config.hideFirstImage;
    },
    toggleBlockMediaNewWindow(state) {
      state.config.blockMediaNewWindow = !state.config.blockMediaNewWindow;
    },
    toggleBlockDeletedArticleMedia(state) {
      state.config.blockDeletedArticleMedia =
        !state.config.blockDeletedArticleMedia;
    },
    toggleRateDownGuard(state) {
      state.config.ratedownGuard = !state.config.ratedownGuard;
    },
    toggleComment(state) {
      state.config.foldComment = !state.config.foldComment;
    },
    toggleWideArea(state) {
      state.config.wideClickArea = !state.config.wideClickArea;
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
