import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

// Site layout
const RECENT_VISIT = { key: 'showRecentVisit', defaultValue: true };
const SIDE_MENU = { key: 'showSideMenu', defaultValue: true };
const AVATAR = { key: 'showAvatar', defaultValue: true };
const NOTIFY_COLOR = { key: 'notificationIconColor', defaultValue: '' };
// Board layout
const USERINFO_WIDTH = { key: 'userinfoWidth', defaultValue: 10 };
// Article layout
const RESIZE_IMAGE = { key: 'resizeArticleImage', defaultValue: 100 };
const RESIZE_VIDEO = { key: 'resizeArticleVideo', defaultValue: 100 };
// Comment layout
const MODIFIED_INDICATOR = { key: 'showModified', defaultValue: false };
const UNFOLD_LONG_COMMENT = { key: 'unfoldLongComment', defaultValue: false };
// Write lyaout
const HIDE_HUMOR_CHECKBOX = { key: 'hideHumorCheckbox', defaultValue: false };

const initialState = {
  recentVisit: getValue(RECENT_VISIT),
  sideMenu: getValue(SIDE_MENU),
  avatar: getValue(AVATAR),
  notifyColor: getValue(NOTIFY_COLOR),
  userinfoWidth: getValue(USERINFO_WIDTH),
  resizeImage: getValue(RESIZE_IMAGE),
  resizeVideo: getValue(RESIZE_VIDEO),
  modifiedIndicator: getValue(MODIFIED_INDICATOR),
  unfoldLongComment: getValue(UNFOLD_LONG_COMMENT),
  hideHumorCheckbox: getValue(HIDE_HUMOR_CHECKBOX),
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    toggleRecentVisit(state) {
      state.recentVisit = !state.recentVisit;
      setValue(RECENT_VISIT, state.recentVisit);
    },
    toggleSideMenu(state) {
      state.sideMenu = !state.sideMenu;
      setValue(SIDE_MENU, state.sideMenu);
    },
    toggleAvatar(state) {
      state.avatar = !state.avatar;
      setValue(AVATAR, state.avatar);
    },
    setNotifyColor(state, action) {
      state.notifyColor = action.payload;
      setValue(NOTIFY_COLOR, state.notifyColor);
    },
    setUserInfoWith(state, action) {
      state.userinfoWidth = action.payload;
      setValue(USERINFO_WIDTH, state.userinfoWidth);
    },
    setResizeImage(state, action) {
      state.resizeImage = action.payload;
      setValue(RESIZE_IMAGE, state.resizeImage);
    },
    setResizeVideo(state, action) {
      state.resizeVideo = action.payload;
      setValue(RESIZE_VIDEO, state.resizeVideo);
    },
    toggleModifiedIndicator(state) {
      state.modifiedIndicator = !state.modifiedIndicator;
      setValue(MODIFIED_INDICATOR, state.modifiedIndicator);
    },
    toggleLongComment(state) {
      state.unfoldLongComment = !state.unfoldLongComment;
      setValue(UNFOLD_LONG_COMMENT, state.unfoldLongComment);
    },
    toggleHumorCheckbox(state) {
      state.hideHumorCheckbox = !state.hideHumorCheckbox;
      setValue(HIDE_HUMOR_CHECKBOX, state.hideHumorCheckbox);
    },
  },
});

export const {
  toggleRecentVisit,
  toggleSideMenu,
  toggleAvatar,
  setNotifyColor,
  setUserInfoWith,
  setResizeImage,
  setResizeVideo,
  toggleModifiedIndicator,
  toggleLongComment,
  toggleHumorCheckbox,
} = slice.actions;

export default slice.reducer;
