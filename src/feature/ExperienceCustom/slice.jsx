import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  openArticleNewWindow: false,
  hideFirstImage: false,
  blockMediaNewWindow: false,
  blockDeletedArticleMedia: true,
  ratedownGuard: false,
  foldComment: false,
  wideClickArea: true,
};

const initialState = {
  config: {
    ...defaultConfigState,
    ...GM_getValue(MODULE_ID),
  },
  hideDeletedArticleMedia: true,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleArticleNewWindow(state) {
      state.config.openArticleNewWindow = !state.config.openArticleNewWindow;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleHideFirstImage(state) {
      state.config.hideFirstImage = !state.config.hideFirstImage;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleBlockMediaNewWindow(state) {
      state.config.blockMediaNewWindow = !state.config.blockMediaNewWindow;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleBlockDeletedArticleMedia(state) {
      state.config.blockDeletedArticleMedia =
        !state.config.blockDeletedArticleMedia;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleHideDeletedArticleMedia(state) {
      state.hideDeletedArticleMedia = !state.hideDeletedArticleMedia;
    },
    toggleRateDownGuard(state) {
      state.config.ratedownGuard = !state.config.ratedownGuard;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleComment(state) {
      state.config.foldComment = !state.config.foldComment;
      GM_setValue(MODULE_ID, state.config);
    },
    toggleWideArea(state) {
      state.config.wideClickArea = !state.config.wideClickArea;
      GM_setValue(MODULE_ID, state.config);
    },
  },
});

export const {
  toggleArticleNewWindow,
  toggleHideFirstImage,
  toggleBlockMediaNewWindow,
  toggleBlockDeletedArticleMedia,
  toggleHideDeletedArticleMedia,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} = slice.actions;

export default slice.reducer;
