import { REGEX } from '../format';

/**
 * 패턴이 일치하는 string을 변환합니다.
 *
 * @param {string} string             변환을 시도할 문자열
 * @param {Object} option             변환 옵션
 * @param {Object} optiop.infoString  useParser(): infoString
 * @param {Number} optiop.index       인덱스 번호
 * @param {string} optiop.fileName    업로드 된 파일의 실제 이름
 * @returns
 */
export default function replaceFormat(
  string,
  { strings, index = 0, fileName = '' },
) {
  const { channel, article } = strings;

  return string
    .replace(REGEX.CHANNEL, channel.name)
    .replace(REGEX.CHANNEL_ID, channel.ID)
    .replace(REGEX.TITLE, article.title)
    .replace(REGEX.CATEGORY, article.category)
    .replace(REGEX.AUTHOR, article.author)
    .replace(REGEX.ARTICLE_ID, article.ID)
    .replace(REGEX.URL, article.url)
    .replace(REGEX.UPLOAD_NAME, fileName)
    .replace(REGEX.NUMBER, `${index}`.padStart(3, '0'));
}
