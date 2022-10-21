import { createSlice } from '@reduxjs/toolkit';

import { getValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultStorage = {
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
  storage: getValue(Info.ID, defaultStorage),
  show: false,
};

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    setPrefixList(state, action) {
      state.storage.prefixList = action.payload;
    },
    setSuffixList(state, action) {
      state.storage.suffixList = action.payload;
    },
    setExtraPrefix(state, action) {
      state.storage.extraPrefix = action.payload;
    },
    toggleShow(state) {
      state.show = !state.show;
    },
  },
  extraReducers: {
    syncStorage(state) {
      state.storage = getValue(Info.ID, defaultStorage);
    },
  },
});

export const { setPrefixList, setSuffixList, setExtraPrefix, toggleShow } =
  slice.actions;

export default slice.reducer;
