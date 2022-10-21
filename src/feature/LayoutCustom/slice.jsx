import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  fontSize: 15,
  topNews: true,
  recentVisit: true,
  sideContents: true,
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

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    setFontSize(state, action) {
      state.storage.fontSize = action.payload;
    },
    toggleTopNews(state) {
      state.storage.topNews = !state.storage.topNews;
    },
    toggleRecentVisit(state) {
      state.storage.recentVisit = !state.storage.recentVisit;
    },
    toggleSideContents(state) {
      state.storage.sideContents = !state.storage.sideContents;
    },
    toggleSideNews(state) {
      state.storage.sideNews = !state.storage.sideNews;
    },
    toggleSideMenu(state) {
      state.storage.sideMenu = !state.storage.sideMenu;
    },
    toggleAvatar(state) {
      state.storage.avatar = !state.storage.avatar;
    },
    setNotifyColor(state, action) {
      state.storage.notifyColor = action.payload;
    },
    setUserInfoWith(state, action) {
      state.storage.userinfoWidth = action.payload;
    },
    setResizeImage(state, action) {
      state.storage.resizeImage = action.payload;
    },
    setResizeVideo(state, action) {
      state.storage.resizeVideo = action.payload;
    },
    toggleUnvote(state) {
      state.storage.hideUnvote = !state.storage.hideUnvote;
    },
    toggleModifiedIndicator(state) {
      state.storage.modifiedIndicator = !state.storage.modifiedIndicator;
    },
    toggleLongComment(state) {
      state.storage.unfoldLongComment = !state.storage.unfoldLongComment;
    },
  },
  extraReducers: {
    syncStorage(state) {
      state.storage = getValue(Info.ID, defaultStorage);
    },
  },
});

export const {
  toggleEnable,
  setFontSize,
  toggleTopNews,
  toggleRecentVisit,
  toggleSideContents,
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
