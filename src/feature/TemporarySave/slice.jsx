import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  tempArticleList: {},
  importTitle: true,
  autoSaveTime: 60,
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
  currentSlot: null,
  loadOpen: false,
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    saveArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = state.currentSlot || timestamp;
      state.config.tempArticleList[state.currentSlot] = { title, content };
      setValue(Info.ID, state.config);
    },
    saveAsArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = timestamp;
      state.config.tempArticleList[state.currentSlot] = { title, content };
      setValue(Info.ID, state.config);
    },
    setArticleList(state, action) {
      state.config.tempArticleList = action.payload;
      setValue(Info.ID, state.config);
    },
    setCurrentSlot(state, action) {
      state.currentSlot = action.payload;
    },
    toggleImportTitle(state) {
      state.config.importTitle = !state.config.importTitle;
      setValue(Info.ID, state.config);
    },
    setAutoTime(state, action) {
      state.config.autoSaveTime = action.payload;
      setValue(Info.ID, state.config);
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
