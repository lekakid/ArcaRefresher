import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

const ARTICLES = { key: 'tempArticles', defaultValue: {} };
const IMPORT_TITLE = { key: 'importTitle', defaultValue: true };
const AUTO_SAVE_TIME = { key: 'autoSaveTempArticleTime', defaultValue: 60 };

const initialState = {
  tempArticleList: getValue(ARTICLES),
  importTitle: getValue(IMPORT_TITLE),
  autoSaveTime: getValue(AUTO_SAVE_TIME),
  currentSlot: null,
  titleInput: null,
  editor: null,
  loadDialogOpen: false,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    saveArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = state.currentSlot || timestamp;
      state.tempArticleList[state.currentSlot] = { title, content };
      setValue(ARTICLES, state.tempArticleList);
    },
    saveAsArticle(state, action) {
      const { timestamp, title, content } = action.payload;

      state.currentSlot = timestamp;
      state.tempArticleList[state.currentSlot] = { title, content };
      setValue(ARTICLES, state.tempArticleList);
    },
    setArticleList(state, action) {
      state.tempArticleList = action.payload;
      setValue(ARTICLES, state.tempArticleList);
    },
    setCurrentSlot(state, action) {
      state.currentSlot = action.payload;
    },
    toggleImportTitle(state) {
      state.importTitle = !state.importTitle;
      setValue(IMPORT_TITLE, state.importTitle);
    },
    setAutoTime(state, action) {
      state.autoSaveTime = action.payload;
      setValue(AUTO_SAVE_TIME, state.autoSaveTime);
    },
    setEditor(state, action) {
      const { title, editor } = action.payload;
      state.titleInput = title;
      state.editor = editor;
    },
    toggleLoadDialog(state) {
      state.loadDialogOpen = !state.loadDialogOpen;
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
  setEditor,
  toggleLoadDialog,
} = slice.actions;

export default slice.reducer;
