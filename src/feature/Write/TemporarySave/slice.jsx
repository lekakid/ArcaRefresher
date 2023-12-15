import { createSlice } from '@reduxjs/toolkit';
import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  tempArticleList: {},
  templateMode: false,
  importTitle: true,
  deleteOnCommit: true,
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
    $addArticle(state, action) {
      const { slot, title, content } = action.payload;

      state.storage.tempArticleList[slot] = { title, content };
    },
    $removeArticle(state, action) {
      const { slot } = action.payload;

      delete state.storage.tempArticleList[slot];
    },
    $setArticleList(state, action) {
      state.storage.tempArticleList = action.payload;
    },
    $toggleTemplateMode(state) {
      state.storage.templateMode = !state.storage.templateMode;
    },
    $toggleImportTitle(state) {
      state.storage.importTitle = !state.storage.importTitle;
    },
    $toggleDeleteOnCommit(state) {
      state.storage.deleteOnCommit = !state.storage.deleteOnCommit;
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
  $addArticle,
  $removeArticle,
  $setArticleList,
  $toggleTemplateMode,
  $toggleImportTitle,
  $toggleDeleteOnCommit,
  $setAutoTime,
  setCurrentSlot,
  setLoadOpen,
} = slice.actions;

export default slice.reducer;
