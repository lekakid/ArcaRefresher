import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  enabled: true,
  fontSize: 15,
  notifyPosition: 'right',
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
  resizeEmoticonPalette: 2,
  hideUnvote: false,
  modifiedIndicator: false,
  hideVoiceComment: false,
  unfoldLongComment: false,
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    $toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    $setFontSize(state, action) {
      state.storage.fontSize = action.payload;
    },
    $setNotifyPosition(state, action) {
      state.storage.notifyPosition = action.payload;
    },
    $toggleTopNews(state) {
      state.storage.topNews = !state.storage.topNews;
    },
    $toggleRecentVisit(state) {
      state.storage.recentVisit = !state.storage.recentVisit;
    },
    $toggleSideContents(state) {
      state.storage.sideContents = !state.storage.sideContents;
    },
    $toggleSideNews(state) {
      state.storage.sideNews = !state.storage.sideNews;
    },
    $toggleSideMenu(state) {
      state.storage.sideMenu = !state.storage.sideMenu;
    },
    $toggleAvatar(state) {
      state.storage.avatar = !state.storage.avatar;
    },
    $setNotifyColor(state, action) {
      state.storage.notifyColor = action.payload;
    },
    $setUserInfoWith(state, action) {
      state.storage.userinfoWidth = action.payload;
    },
    $setResizeImage(state, action) {
      state.storage.resizeImage = action.payload;
    },
    $setResizeVideo(state, action) {
      state.storage.resizeVideo = action.payload;
    },
    $setResizeEmoticonPalette(state, action) {
      state.storage.resizeEmoticonPalette = action.payload;
    },
    $toggleUnvote(state) {
      state.storage.hideUnvote = !state.storage.hideUnvote;
    },
    $toggleModifiedIndicator(state) {
      state.storage.modifiedIndicator = !state.storage.modifiedIndicator;
    },
    $toggleHideVoiceComment(state) {
      state.storage.hideVoiceComment = !state.storage.hideVoiceComment;
    },
    $toggleLongComment(state) {
      state.storage.unfoldLongComment = !state.storage.unfoldLongComment;
    },
  },
});

export const {
  $toggleEnable,
  $setFontSize,
  $setNotifyPosition,
  $toggleTopNews,
  $toggleRecentVisit,
  $toggleSideContents,
  $toggleSideNews,
  $toggleSideMenu,
  $toggleAvatar,
  $setNotifyColor,
  $setUserInfoWith,
  $setResizeImage,
  $setResizeVideo,
  $setResizeEmoticonPalette,
  $toggleUnvote,
  $toggleModifiedIndicator,
  $toggleHideVoiceComment,
  $toggleLongComment,
} = slice.actions;

export default slice.reducer;
