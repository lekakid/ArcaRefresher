import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  tempArticleList: {},
  importTitle: true,
  autoSaveTime: 60,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
  currentSlot: null,
  loadOpen: false,
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $saveArticle(state, action) {
      const { slot, title, content } = action.payload;

      state.storage.tempArticleList[slot] = { title, content };
    },
    $setArticleList(state, action) {
      state.storage.tempArticleList = action.payload;
    },
    $toggleImportTitle(state) {
      state.storage.importTitle = !state.storage.importTitle;
    },
    $setAutoTime(state, action) {
      state.storage.autoSaveTime = action.payload;
    },
    setCurrentSlot(state, action) {
      state.currentSlot = action.payload;
    },
    setLoadOpen(state, action) {
      state.loadOpen = action.payload;
    },
  },
});

export const {
  $saveArticle,
  $setArticleList,
  $toggleImportTitle,
  $setAutoTime,
  setCurrentSlot,
  setLoadOpen,
} = slice.actions;

export default slice.reducer;
