import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import info from './info';

const defaultStorage = {
  enabled: true,
};

const initialState = {
  storage: getValue(info.id, defaultStorage),
  // 이 아래에 인터페이스 제어용 state 추가
  show: true,
};

export const slice = createSlice({
  name: info.id,
  initialState,
  reducers: {
    // storage 내부 제어 리듀서는 맨앞에 $를 추가하여 구분합니다.
    // 탭간의 Redux state 동기화 시 이름에 $가 포함되는지로 동기화 여부를 결정합니다.
    $toggleEnabled(state) {
      state.storage.enabled = !state.storage.enabled;
    },
  },
});

export const { $toggleEnabled } = slice.actions;

export default slice.reducer;
