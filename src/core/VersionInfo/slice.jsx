import { GM_getValue, GM_info } from '$';
import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'store/storage';

import { TYPE_MINOR } from './func';
import info from './info';

const defaultStorage = {
  version: 1,

  lastVersion: GM_info.script.version,
  checkedVersion: GM_info.script.version,
  notiLevel: TYPE_MINOR,
};

function updater(storage, defaultValue) {
  // version 0 => 1
  const version = storage?.version || 0;

  switch (version) {
    case 0: {
      // NOTE 3.45.0 릴리즈에 ID값이 __VersionInfo__ 바뀔 예정
      // 키가 바뀌는 경우 updater가 감지 못하는 문제가 있음
      // 3.44.0 배포 전에 별도로 __를 앞뒤로 추가한 키로 저장하게 끔 적용할 예정
      const prev = GM_getValue('VersionInfo', null);
      if (!prev) return defaultStorage;

      return { ...defaultValue, ...prev };
    }
    default:
      console.warn('지원하지 않는 버전 데이터입니다.', storage);
      return defaultValue;
  }
}

const initialState = {
  storage: getValue(info.id, defaultStorage, updater),
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    $setLastVersion(state, action) {
      state.storage.lastVersion = action.payload;
    },
    $setCheckedVersion(state, action) {
      state.storage.checkedVersion = action.payload;
    },
    $setNotiLevel(state, action) {
      state.storage.notiLevel = action.payload;
    },
  },
});

export const { $setLastVersion, $setCheckedVersion, $setNotiLevel } =
  slice.actions;

export default [info.id, slice.reducer];
