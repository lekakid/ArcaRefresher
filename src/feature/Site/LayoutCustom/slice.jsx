import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  enabled: true,
  // 사이트
  notifyPosition: 'right',
  topNews: true,
  searchBar: true,
  recentVisit: 'afterAd',
  sideMenu: true,
  sideContents: true,
  sideBests: true,
  sideNews: true,
  avatar: true,
  userinfoWidth: 10,
  rateCount: true,
  // 게시물
  hideDefaultImage: false,
  resizeImage: 100,
  resizeVideo: 100,
  hideUnvote: false,
  // 댓글
  unfoldLongComment: false,
  modifiedIndicator: false,
  reverseComment: false,
  hideVoiceComment: false,
  resizeEmoticonPalette: 2,
  // 접근성
  fontSize: 15,
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
  storage: getValue(Info.id, defaultStorage, formatUpdater),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    $toggleEnable(state) {
      state.storage.enabled = !state.storage.enabled;
    },
    // 사이트
    $setNotifyPosition(state, action) {
      state.storage.notifyPosition = action.payload;
    },
    $toggleTopNews(state) {
      state.storage.topNews = !state.storage.topNews;
    },
    $toggleSearchBar(state) {
      state.storage.searchBar = !state.storage.searchBar;
    },
    $setRecentVisit(state, action) {
      state.storage.recentVisit = action.payload;
    },
    $toggleSideMenu(state) {
      state.storage.sideMenu = !state.storage.sideMenu;
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
    $toggleAvatar(state) {
      state.storage.avatar = !state.storage.avatar;
    },
    // 게시판
    $setUserInfoWith(state, action) {
      state.storage.userinfoWidth = action.payload;
    },
    $toggleRateCount(state) {
      state.storage.rateCount = !state.storage.rateCount;
    },
    // 게시물
    $toggleDefaultImage(state) {
      state.storage.hideDefaultImage = !state.storage.hideDefaultImage;
    },
    $setResizeImage(state, action) {
      state.storage.resizeImage = action.payload;
    },
    $setResizeVideo(state, action) {
      state.storage.resizeVideo = action.payload;
    },
    $toggleUnvote(state) {
      state.storage.hideUnvote = !state.storage.hideUnvote;
    },
    // 댓글
    $toggleLongComment(state) {
      state.storage.unfoldLongComment = !state.storage.unfoldLongComment;
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
    $setResizeEmoticonPalette(state, action) {
      state.storage.resizeEmoticonPalette = action.payload;
    },
    // 접근성
    $setFontSize(state, action) {
      state.storage.fontSize = action.payload;
    },
    $toggleDarkModeWriteForm(state) {
      state.storage.fixDarkModeWriteForm = !state.storage.fixDarkModeWriteForm;
    },
  },
});

export const {
  $toggleEnable,
  // 사이트
  $setNotifyPosition,
  $toggleTopNews,
  $toggleSearchBar,
  $setRecentVisit,
  $toggleSideMenu,
  $toggleSideContents,
  $toggleSideBests,
  $toggleSideNews,
  $toggleAvatar,
  $setUserInfoWith,
  $toggleRateCount,
  // 게시물
  $toggleDefaultImage,
  $setResizeImage,
  $setResizeVideo,
  $toggleUnvote,
  // 댓글
  $toggleLongComment,
  $toggleModifiedIndicator,
  $toggleReverseComment,
  $toggleHideVoiceComment,
  $setResizeEmoticonPalette,
  // 접근성
  $setFontSize,
  $toggleDarkModeWriteForm,
} = slice.actions;

export default slice.reducer;
