import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  tempArticleList: {},
  importTitle: true,
  autoSaveTime: 60,
};

const initialState = {
  config: getValue(MODULE_ID, defaultConfigState),
  currentSlot: null,
  loadOpen: false,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    saveArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = state.currentSlot || timestamp;
      state.config.tempArticleList[state.currentSlot] = { title, content };
      setValue(MODULE_ID, state.config);
    },
    saveAsArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = timestamp;
      state.config.tempArticleList[state.currentSlot] = { title, content };
      setValue(MODULE_ID, state.config);
    },
    setArticleList(state, action) {
      state.config.tempArticleList = action.payload;
      setValue(MODULE_ID, state.config);
    },
    setCurrentSlot(state, action) {
      state.currentSlot = action.payload;
    },
    toggleImportTitle(state) {
      state.config.importTitle = !state.config.importTitle;
      setValue(MODULE_ID, state.config);
    },
    setAutoTime(state, action) {
      state.config.autoSaveTime = action.payload;
      setValue(MODULE_ID, state.config);
    },
    setLoadOpen(state, action) {
      state.loadOpen = action.payload;
    },
  },
});

export const {
  saveArticle,
  saveAsArticle,
  setArticleList,
  setCurrentSlot,
  toggleImportTitle,
  setAutoTime,
  setLoadOpen,
} = slice.actions;

export default slice.reducer;
