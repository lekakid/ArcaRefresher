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
    saveArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = state.currentSlot || timestamp;
      state.storage.tempArticleList[state.currentSlot] = { title, content };
    },
    saveAsArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = timestamp;
      state.storage.tempArticleList[state.currentSlot] = { title, content };
    },
    setArticleList(state, action) {
      state.storage.tempArticleList = action.payload;
    },
    setCurrentSlot(state, action) {
      state.currentSlot = action.payload;
    },
    toggleImportTitle(state) {
      state.storage.importTitle = !state.storage.importTitle;
    },
    setAutoTime(state, action) {
      state.storage.autoSaveTime = action.payload;
    },
    setLoadOpen(state, action) {
      state.loadOpen = action.payload;
    },
  },
  extraReducers: {
    syncStorage(state) {
      state.storage = getValue(Info.ID, defaultStorage);
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
