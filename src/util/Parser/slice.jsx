import { createSlice } from '@reduxjs/toolkit';
import { MODULE_ID } from './ModuleInfo';

const initialState = {
  channelID: null,
  channelName: null,
  category: null,
};

export const slice = createSlice({
  name: MODULE_ID,
  initialState,
  reducers: {
    setChannelID(state, action) {
      state.channelID = action.payload;
    },
    setChannelName(state, action) {
      state.channelName = action.payload;
    },
    setCategory(state, action) {
      state.category = action.payload;
    },
  },
});

export const { setChannelID, setChannelName, setCategory } = slice.actions;

export default slice.reducer;
