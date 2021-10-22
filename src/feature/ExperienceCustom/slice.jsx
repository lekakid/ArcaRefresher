import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  openArticleNewWindow: false,
  blockMediaNewWindow: false,
  ratedownGuard: false,
  foldComment: false,
  wideClickArea: true,
};

const initialState = {
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleArticleNewWindow(state) {
      state.openArticleNewWindow = !state.openArticleNewWindow;
      GM_setValue(MODULE_ID, state);
    },
    toggleMediaNewWindow(state) {
      state.blockMediaNewWindow = !state.blockMediaNewWindow;
      GM_setValue(MODULE_ID, state);
    },
    toggleRateDownGuard(state) {
      state.ratedownGuard = !state.ratedownGuard;
      GM_setValue(MODULE_ID, state);
    },
    toggleComment(state) {
      state.foldComment = !state.foldComment;
      GM_setValue(MODULE_ID, state);
    },
    toggleWideArea(state) {
      state.wideClickArea = !state.wideClickArea;
      GM_setValue(MODULE_ID, state);
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
