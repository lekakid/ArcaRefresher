import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

// Board
const OPEN_ARTICLE = { key: 'openNewWindow', defaultValue: false };
const BLOCK_MEDIA = { key: 'blockImageNewWindow', defaultValue: false };
// Article
const RATEDOWN_GUARD = { key: 'blockRatedown', defaultValue: false };
// Comment
const FOLD_COMMENT = { key: 'foldComment', defaultValue: true };
const WIDE_AREA = { key: 'wideCommentArea', defaultValue: true };

const initialState = {
  openArticleNewWindow: getValue(OPEN_ARTICLE),
  blockMediaNewWindow: getValue(BLOCK_MEDIA),
  ratedownGuard: getValue(RATEDOWN_GUARD),
  foldComment: getValue(FOLD_COMMENT),
  wideArea: getValue(WIDE_AREA),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleArticleNewWindow(state) {
      state.openArticleNewWindow = !state.openArticleNewWindow;
      setValue(OPEN_ARTICLE, state.openArticleNewWindow);
    },
    toggleMediaNewWindow(state) {
      state.blockMediaNewWindow = !state.blockMediaNewWindow;
      setValue(BLOCK_MEDIA, state.blockMediaNewWindow);
    },
    toggleRateDownGuard(state) {
      state.ratedownGuard = !state.ratedownGuard;
      setValue(RATEDOWN_GUARD, state.ratedownGuard);
    },
    toggleComment(state) {
      state.foldComment = !state.foldComment;
      setValue(FOLD_COMMENT, state.foldComment);
    },
    toggleWideArea(state) {
      state.wideArea = !state.wideArea;
      setValue(WIDE_AREA, state.wideArea);
    },
  },
});

export const {
  toggleArticleNewWindow,
  toggleMediaNewWindow,
  toggleRateDownGuard,
  toggleComment,
  toggleWideArea,
} = slice.actions;

export default slice.reducer;
