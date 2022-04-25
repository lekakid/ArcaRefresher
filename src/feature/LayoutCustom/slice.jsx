import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  enabled: true,
  fontSize: 15,
  topNews: true,
  recentVisit: true,
  sideHumor: true,
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
  ...defaultConfigState,
  ...GM_getValue(MODULE_ID),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleEnable(state) {
      state.enabled = !state.enabled;
      GM_setValue(MODULE_ID, state);
    },
    setFontSize(state, action) {
      state.fontSize = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    toggleTopNews(state) {
      state.topNews = !state.topNews;
      GM_setValue(MODULE_ID, state);
    },
    toggleRecentVisit(state) {
      state.recentVisit = !state.recentVisit;
      GM_setValue(MODULE_ID, state);
    },
    toggleSideHumor(state) {
      state.sideHumor = !state.sideHumor;
      GM_setValue(MODULE_ID, state);
    },
    toggleSideNews(state) {
      state.sideNews = !state.sideNews;
      GM_setValue(MODULE_ID, state);
    },
    toggleSideMenu(state) {
      state.sideMenu = !state.sideMenu;
      GM_setValue(MODULE_ID, state);
    },
    toggleAvatar(state) {
      state.avatar = !state.avatar;
      GM_setValue(MODULE_ID, state);
    },
    setNotifyColor(state, action) {
      state.notifyColor = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    setUserInfoWith(state, action) {
      state.userinfoWidth = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    setResizeImage(state, action) {
      state.resizeImage = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    setResizeVideo(state, action) {
      state.resizeVideo = action.payload;
      GM_setValue(MODULE_ID, state);
    },
    toggleUnvote(state) {
      state.hideUnvote = !state.hideUnvote;
      GM_setValue(MODULE_ID, state);
    },
    toggleModifiedIndicator(state) {
      state.modifiedIndicator = !state.modifiedIndicator;
      GM_setValue(MODULE_ID, state);
    },
    toggleLongComment(state) {
      state.unfoldLongComment = !state.unfoldLongComment;
      GM_setValue(MODULE_ID, state);
    },
  },
});

export const {
  toggleEnable,
  setFontSize,
  toggleTopNews,
  toggleRecentVisit,
  toggleSideHumor,
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
