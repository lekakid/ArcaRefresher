import { REGEX } from '../format';

export default function replaceFormat(string, flagMap) {
  const {
    channelID,
    channelName,
    articleCategory,
    articleTitle,
    articleAuthor,
    articleURL,
    uploadName = '',
    index = 0,
  } = flagMap;

  return string
    .replace(REGEX.CHANNEL, channelName)
    .replace(REGEX.CHANNEL_ID, channelID)
    .replace(REGEX.TITLE, articleTitle)
    .replace(REGEX.CATEGORY, articleCategory)
    .replace(REGEX.AUTHOR, articleAuthor)
    .replace(REGEX.URL, articleURL)
    .replace(REGEX.UPLOAD_NAME, uploadName)
    .replace(REGEX.NUMBER, `${index}`.padStart(3, '0'));
}
