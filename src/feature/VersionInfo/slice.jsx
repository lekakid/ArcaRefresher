import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import Info from './FeatureInfo';

const defaultConfigState = {
  checkedVersion: '',
};

const initialState = getValue(Info.ID, defaultConfigState);

export const slice = createSlice({
  name: Info.ID,
  initialState,
  reducers: {
    updateCheckedVersion(state) {
      // eslint-disable-next-line camelcase
      state.checkedVersion = GM_info.script.version;
      setValue(Info.ID, state);
    },
  },
});

export const { updateCheckedVersion } = slice.actions;

export default slice.reducer;
