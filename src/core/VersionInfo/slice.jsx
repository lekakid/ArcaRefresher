import { GM_info } from '$';
import { createSlice } from '@reduxjs/toolkit';

import { deleteValue, getValue } from 'store/storage';

import { TYPE_MINOR } from './func';
import info from './info';

const defaultStorage = {
  version: 1,

  lastVersion: GM_info.script.version,
  checkedVersion: GM_info.script.version,
  notiLevel: TYPE_MINOR,
};

// NOTE 3.44 릴리즈에 끼워넣기 대신 그냥 직접 불러오는 형태
// 3.45 업데이트 직후 알림이 문제일 뿐 손실되어도 딱히 문제 없는 데이터이기 때문
// 3.46 릴리즈 쯤에 삭제
const prev = getValue('VersionInfo');
if (prev) {
  deleteValue('VersionInfo');
}
const current = getValue(info.id, defaultStorage);

const initialState = {
  storage: prev ?? current,
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
