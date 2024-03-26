import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  version: 1,
  // 모양
  userinfoWidth: 10,
  rateCount: true,
  // 동작
  openArticleNewWindow: false,
  enhancedArticleManage: true,
  // 우클릭
  contextMenuEnabled: true,
};

function updater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      const keys = Object.keys(defaultValue).filter((k) => k !== 'version');
      const entries = [];
      const oldLayoutValues = getValue('LayoutCustom');
      if (oldLayoutValues) {
        entries.push(
          ...Object.entries(oldLayoutValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }
      const oldExpValues = getValue('ExperienceCustom');
      if (oldExpValues) {
        entries.push(
          ...Object.entries(oldExpValues).filter((pair) =>
            keys.includes(pair[0]),
          ),
        );
      }

      return { ...defaultValue, ...Object.fromEntries(entries) };
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(Info.id, defaultStorage, updater),
};

export const slice = createSlice({
  name: Info.id,
  initialState,
  reducers: {
    // 모양
    $setUserInfoWith(state, action) {
      state.storage.userinfoWidth = action.payload;
    },
    $toggleRateCount(state) {
      state.storage.rateCount = !state.storage.rateCount;
    },
    // 동작
    $toggleArticleNewWindow(state) {
      state.storage.openArticleNewWindow = !state.storage.openArticleNewWindow;
    },
    $toggleEnhancedArticleManage(state) {
      state.storage.enhancedArticleManage =
        !state.storage.enhancedArticleManage;
    },
    // 우클릭
    $toggleContextMenu(state) {
      state.storage.contextMenuEnabled = !state.storage.contextMenuEnabled;
    },
  },
});

export const {
  // 모양
  $setUserInfoWith,
  $toggleRateCount,
  // 동작
  $toggleArticleNewWindow,
  $toggleEnhancedArticleManage,
  // 우클릭 메뉴
  $toggleContextMenu,
} = slice.actions;

export default slice.reducer;
