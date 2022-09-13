import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
  fontSize: 15,
  topNews: true,
  recentVisit: true,
  sideNews: true,
  sideMenu: true,
  avatar: true,
  notifyColor: '',
  userinfoWidth: 10,
  resizeImage: 100,
  resizeVideo: 100,
  hideUnvote: false,
  modifiedIndicator: false,
  unfoldLongComment: false,
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(MODULE_ID, state);
    },
    setFontSize(state, action) {
      state.fontSize = action.payload;
      setValue(MODULE_ID, state);
    },
    toggleTopNews(state) {
      state.topNews = !state.topNews;
      setValue(MODULE_ID, state);
    },
    toggleRecentVisit(state) {
      state.recentVisit = !state.recentVisit;
      setValue(MODULE_ID, state);
    },
    toggleSideNews(state) {
      state.sideNews = !state.sideNews;
      setValue(MODULE_ID, state);
    },
    toggleSideMenu(state) {
      state.sideMenu = !state.sideMenu;
      setValue(MODULE_ID, state);
    },
    toggleAvatar(state) {
      state.avatar = !state.avatar;
      setValue(MODULE_ID, state);
    },
    setNotifyColor(state, action) {
      state.notifyColor = action.payload;
      setValue(MODULE_ID, state);
    },
    setUserInfoWith(state, action) {
      state.userinfoWidth = action.payload;
      setValue(MODULE_ID, state);
    },
    setResizeImage(state, action) {
      state.resizeImage = action.payload;
      setValue(MODULE_ID, state);
    },
    setResizeVideo(state, action) {
      state.resizeVideo = action.payload;
      setValue(MODULE_ID, state);
    },
    toggleUnvote(state) {
      state.hideUnvote = !state.hideUnvote;
      setValue(MODULE_ID, state);
    },
    toggleModifiedIndicator(state) {
      state.modifiedIndicator = !state.modifiedIndicator;
      setValue(MODULE_ID, state);
    },
    toggleLongComment(state) {
      state.unfoldLongComment = !state.unfoldLongComment;
      setValue(MODULE_ID, state);
    },
  },
});

export const {
  toggleEnable,
  setFontSize,
  toggleTopNews,
  toggleRecentVisit,
  toggleSideNews,
  toggleSideMenu,
  toggleAvatar,
  setNotifyColor,
  setUserInfoWith,
  setResizeImage,
  setResizeVideo,
  toggleUnvote,
  toggleModifiedIndicator,
  toggleLongComment,
} = slice.actions;

export default slice.reducer;
