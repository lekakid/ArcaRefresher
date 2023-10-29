import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  enabled: true,
  fontSize: 15,
  notifyPosition: 'right',
  topNews: true,
  recentVisit: 'afterAd',
  sideContents: true,
  sideBests: true,
  sideNews: true,
  sideMenu: true,
  avatar: true,
  userinfoWidth: 10,
  resizeImage: 100,
  resizeVideo: 100,
  resizeEmoticonPalette: 2,
  hideUnvote: false,
  modifiedIndicator: false,
  reverseComment: false,
  hideVoiceComment: false,
  unfoldLongComment: false,
  fixDarkModeWriteForm: true,
};

function formatUpdater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const updateStorage = { ...storage };
      updateStorage.recentVisit = updateStorage.recentVisit
        ? 'afterAd'
        : 'none';
      updateStorage.version = 1;
      return updateStorage;
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.ID, defaultStorage, formatUpdater),
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
    $setRecentVisit(state, action) {
      state.storage.recentVisit = action.payload;
    },
    $toggleSideContents(state) {
      state.storage.sideContents = !state.storage.sideContents;
    },
    $toggleSideBests(state) {
      state.storage.sideBests = !state.storage.sideBests;
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
    $toggleReverseComment(state) {
      state.storage.reverseComment = !state.storage.reverseComment;
    },
    $toggleHideVoiceComment(state) {
      state.storage.hideVoiceComment = !state.storage.hideVoiceComment;
    },
    $toggleLongComment(state) {
      state.storage.unfoldLongComment = !state.storage.unfoldLongComment;
    },
    $toggleDarkModeWriteForm(state) {
      state.storage.fixDarkModeWriteForm = !state.storage.fixDarkModeWriteForm;
    },
  },
});

export const {
  $toggleEnable,
  $setFontSize,
  $setNotifyPosition,
  $toggleTopNews,
  $setRecentVisit,
  $toggleSideContents,
  $toggleSideBests,
  $toggleSideNews,
  $toggleSideMenu,
  $toggleAvatar,
  $setUserInfoWith,
  $setResizeImage,
  $setResizeVideo,
  $setResizeEmoticonPalette,
  $toggleUnvote,
  $toggleModifiedIndicator,
  $toggleReverseComment,
  $toggleHideVoiceComment,
  $toggleLongComment,
  $toggleDarkModeWriteForm,
} = slice.actions;

export default slice.reducer;
