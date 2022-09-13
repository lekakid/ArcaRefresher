import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  prefixList: [
    '웃는',
    '화난',
    '불쌍한',
    '즐거운',
    '건장한',
    '해탈한',
    '광기의',
    '귀여운',
    '곱슬머리',
    '개구쟁이',
    '자신있는',
    '방구석',
    '노래하는',
    '책읽는',
    '구르는',
    '비틀거리는',
    '힘든',
    '순수한',
    '행복한',
    '불닭먹는',
  ],
  suffixList: [
    '미호',
    '캬루',
    '둘리',
    '도바킨',
    '테레사',
    '윾돌이',
    '보노보노',
    '다비',
    '공룡',
    '아야',
  ],
  extraPrefix: '비둘기',
};

const initialState = {
  config: getValue(MODULE_ID, defaultConfigState),
  show: false,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setPrefixList(state, action) {
      state.config.prefixList = action.payload;
      setValue(MODULE_ID, state.config);
    },
    setSuffixList(state, action) {
      state.config.suffixList = action.payload;
      setValue(MODULE_ID, state.config);
    },
    setExtraPrefix(state, action) {
      state.config.extraPrefix = action.payload;
      setValue(MODULE_ID, state.config);
    },
    toggleShow(state) {
      state.show = !state.show;
    },
  },
});

export const { setPrefixList, setSuffixList, setExtraPrefix, toggleShow } =
  slice.actions;

export default slice.reducer;
