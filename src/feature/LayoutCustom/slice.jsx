import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
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
  config: getValue(Info.ID, defaultConfigState),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.config.enabled = !state.config.enabled;
    },
    setFontSize(state, action) {
      state.config.fontSize = action.payload;
    },
    toggleTopNews(state) {
      state.config.topNews = !state.config.topNews;
    },
    toggleRecentVisit(state) {
      state.config.recentVisit = !state.config.recentVisit;
    },
    toggleSideContents(state) {
      state.config.sideContents = !state.config.sideContents;
    },
    toggleSideNews(state) {
      state.config.sideNews = !state.config.sideNews;
    },
    toggleSideMenu(state) {
      state.config.sideMenu = !state.config.sideMenu;
    },
    toggleAvatar(state) {
      state.config.avatar = !state.config.avatar;
    },
    setNotifyColor(state, action) {
      state.config.notifyColor = action.payload;
    },
    setUserInfoWith(state, action) {
      state.config.userinfoWidth = action.payload;
    },
    setResizeImage(state, action) {
      state.config.resizeImage = action.payload;
    },
    setResizeVideo(state, action) {
      state.config.resizeVideo = action.payload;
    },
    toggleUnvote(state) {
      state.config.hideUnvote = !state.config.hideUnvote;
    },
    toggleModifiedIndicator(state) {
      state.config.modifiedIndicator = !state.config.modifiedIndicator;
    },
    toggleLongComment(state) {
      state.config.unfoldLongComment = !state.config.unfoldLongComment;
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
