import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from 'core/gm';
import { MODULE_ID } from './ModuleInfo';

const ENABLED = { key: 'useContextMenu', defaultValue: true };

const initialState = {
  enabled: getValue(ENABLED),
  open: false,
  snack: false,
  snackTime: null,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setEnable(state) {
      state.enabled = !state.enabled;
      setValue(ENABLED, state.enabled);
    },
    setOpen(state) {
      state.open = true;
    },
    setClose(state) {
      state.open = false;
    },
    setContextSnack(state, action) {
      const { msg, time } = action.payload;
      state.snack = msg;
      state.snackTime = time || null;
    },
  },
});

export const { setEnable, setOpen, setClose, setContextSnack } = slice.actions;

export default slice.reducer;
