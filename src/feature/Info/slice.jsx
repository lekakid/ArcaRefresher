import { createSlice } from '@reduxjs/toolkit';

import { getValue, setValue } from 'core/storage';
import { MODULE_ID } from './ModuleInfo';

const defaultConfigState = {
  checkedVersion: '',
};

const initialState = getValue(MODULE_ID, defaultConfigState);

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    updateCheckedVersion(state) {
      // eslint-disable-next-line camelcase
      state.checkedVersion = GM_info.script.version;
      setValue(MODULE_ID, state);
    },
  },
});

export const { updateCheckedVersion } = slice.actions;

export default slice.reducer;
