import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
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
      setValue(Info.ID, state.config);
    },
    toggleHideFirstImage(state) {
      state.config.hideFirstImage = !state.config.hideFirstImage;
      setValue(Info.ID, state.config);
    },
    toggleBlockMediaNewWindow(state) {
      state.config.blockMediaNewWindow = !state.config.blockMediaNewWindow;
      setValue(Info.ID, state.config);
    },
    toggleBlockDeletedArticleMedia(state) {
      state.config.blockDeletedArticleMedia =
        !state.config.blockDeletedArticleMedia;
      setValue(Info.ID, state.config);
    },
    toggleRateDownGuard(state) {
      state.config.ratedownGuard = !state.config.ratedownGuard;
      setValue(Info.ID, state.config);
    },
    toggleComment(state) {
      state.config.foldComment = !state.config.foldComment;
      setValue(Info.ID, state.config);
    },
    toggleWideArea(state) {
      state.config.wideClickArea = !state.config.wideClickArea;
      setValue(Info.ID, state.config);
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
