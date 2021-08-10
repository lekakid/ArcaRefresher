import { createSlice } from '@reduxjs/toolkit';
import { getValue, setValue } from '../$Common/GMValue';

const FILE_NAME = { key: 'imageDownloaderFileName', defaultValue: '%title%' };
const ZIP_NAME = { key: 'imageDownloaderZipName', defaultValue: '%title%' };
const IMAGE_NAME = { key: 'imageDonwloaderImageName', defaultValue: '%num%' };
const ZIP_COMMENT = {
  key: 'imageDownloaderZipComment',
  defaultValue: '[%channel%] %title% - %url%',
};
const RETRY_COUNT = { key: 'imageDownloaderRetry', defaultValue: 3 };

const initialState = {
  fileName: getValue(FILE_NAME),
  zipName: getValue(ZIP_NAME),
  zipImageName: getValue(IMAGE_NAME),
  zipComment: getValue(ZIP_COMMENT),
  retryCount: getValue(RETRY_COUNT),
};

export const slice = createSlice({
  name: 'ImageDownloader',
  initialState,
  reducers: {
    setFileName(state, action) {
      state.fileName = action.payload;
      setValue(FILE_NAME, action.payload);
    },
    setZipName(state, action) {
      state.zipName = action.payload;
      setValue(ZIP_NAME, action.payload);
    },
    setZipImageName(state, action) {
      state.zipImageName = action.payload;
      setValue(IMAGE_NAME, action.payload);
    },
    setZipComment(state, action) {
      state.zipComment = action.payload;
      setValue(ZIP_COMMENT, action.payload);
    },
    setRetryCount(state, action) {
      state.retryCount = action.payload;
      setValue(RETRY_COUNT, action.payload);
    },
  },
});

export const {
  setFileName,
  setZipName,
  setZipImageName,
  setZipComment,
  setRetryCount,
} = slice.actions;

export default slice.reducer;
