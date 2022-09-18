import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  enabled: true,
  deletedOnly: true,
};

const initialState = {
  config: getValue(Info.ID, defaultConfigState),
  // 이 아래에 인터페이스 제어용 state 추가
  // show: true
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    toggleEnabled(state) {
      state.config.enabled = !state.config.enabled;
      setValue(Info.ID, state.config);
    },
    toggleDeletedOnly(state) {
      state.config.deletedOnly = !state.config.deletedOnly;
      setValue(Info.ID, state.config);
    },
  },
});

export const { toggleEnabled, toggleDeletedOnly } = slice.actions;

// 아래 파일에 모듈 추가 작업 필요
// LINK src/core/store.jsx
export default slice.reducer;
