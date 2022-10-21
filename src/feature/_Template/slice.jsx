import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
  template: 'template',
};

const initialState = {
  storage: getValue(Info.ID, defaultStorage),
  // 이 아래에 인터페이스 제어용 state 추가
  // show: true
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    someReducer(state, action) {
      state.storage.prefixList = action.payload;
    },
  },
  extraReducers: {
    // 모든 탭의 설정을 동기화하는데 사용됨
    syncStorage(state) {
      state.storage = getValue(Info.ID, defaultStorage);
    },
  },
});

export const { someReducer } = slice.actions;

// 아래 파일에 모듈 추가 작업 필요
// LINK src/core/store.jsx
export default slice.reducer;
