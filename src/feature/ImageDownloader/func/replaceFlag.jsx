export default function replaceFlag(string, flagMap) {
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
    .replace(/%channel%/, channelName)
    .replace(/%channelID%/, channelID)
    .replace(/%title%/, articleTitle)
    .replace(/%category%/, articleCategory)
    .replace(/%author%/, articleAuthor)
    .replace(/%url%/, articleURL)
    .replace(/%orig%/, uploadName)
    .replace(/%num%/, `${index}`.padStart(3, '0'));
}
