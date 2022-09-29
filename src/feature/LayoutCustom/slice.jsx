import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
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

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      setValue(Info.ID, state);
    },
    setFontSize(state, action) {
      state.fontSize = action.payload;
      setValue(Info.ID, state);
    },
    toggleTopNews(state) {
      state.topNews = !state.topNews;
      setValue(Info.ID, state);
    },
    toggleRecentVisit(state) {
      state.recentVisit = !state.recentVisit;
      setValue(Info.ID, state);
    },
    toggleSideContents(state) {
      state.sideContents = !state.sideContents;
      setValue(Info.ID, state);
    },
    toggleSideNews(state) {
      state.sideNews = !state.sideNews;
      setValue(Info.ID, state);
    },
    toggleSideMenu(state) {
      state.sideMenu = !state.sideMenu;
      setValue(Info.ID, state);
    },
    toggleAvatar(state) {
      state.avatar = !state.avatar;
      setValue(Info.ID, state);
    },
    setNotifyColor(state, action) {
      state.notifyColor = action.payload;
      setValue(Info.ID, state);
    },
    setUserInfoWith(state, action) {
      state.userinfoWidth = action.payload;
      setValue(Info.ID, state);
    },
    setResizeImage(state, action) {
      state.resizeImage = action.payload;
      setValue(Info.ID, state);
    },
    setResizeVideo(state, action) {
      state.resizeVideo = action.payload;
      setValue(Info.ID, state);
    },
    toggleUnvote(state) {
      state.hideUnvote = !state.hideUnvote;
      setValue(Info.ID, state);
    },
    toggleModifiedIndicator(state) {
      state.modifiedIndicator = !state.modifiedIndicator;
      setValue(Info.ID, state);
    },
    toggleLongComment(state) {
      state.unfoldLongComment = !state.unfoldLongComment;
      setValue(Info.ID, state);
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
