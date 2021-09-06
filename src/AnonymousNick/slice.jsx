import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';
import { MODULE_ID } from './ModuleInfo';

const DefaultPrefix = [
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
];
const DefaultSuffix = [
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
];

const PREFIX = { key: 'AnonymousNickPrefix', defaultValue: DefaultPrefix };
const SUFFIX = { key: 'AnonymousNickSuffix', defaultValue: DefaultSuffix };
const EXTRA = { key: 'AnonymousNickExtra', defaultValue: '비둘기' };

const initialState = {
  prefixList: getValue(PREFIX),
  suffixList: getValue(SUFFIX),
  extraPrefix: getValue(EXTRA),
  show: false,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setPrefixList(state, action) {
      state.prefixList = action.payload;
      setValue(PREFIX, action.payload);
    },
    setSuffixList(state, action) {
      state.suffixList = action.payload;
      setValue(SUFFIX, action.payload);
    },
    setExtraPrefix(state, action) {
      state.extraPrefix = action.payload;
      setValue(EXTRA, action.payload);
    },
    toggleShow(state) {
      state.show = !state.show;
    },
  },
});

export const { setPrefixList, setSuffixList, setExtraPrefix, toggleShow } =
  slice.actions;

export default slice.reducer;
