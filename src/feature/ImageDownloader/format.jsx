export const FORMAT_STRING = {
  CHANNEL: '%channel%',
  CHANNEL_ID: '%channelID%',
  TITLE: '%title%',
  CATEGORY: '%category%',
  AUTHOR: '%author%',
  ARTICLE_ID: '%articleID%',
  URL: '%url%',
  UPLOAD_NAME: '%orig%',
  NUMBER: '%num%',
};

export const REGEX = {
  CHANNEL: /%channel%/,
  CHANNEL_ID: /%channelID%/,
  TITLE: /%title%/,
  CATEGORY: /%category%/,
  AUTHOR: /%author%/,
  ARTICLE_ID: /%articleID%/,
  URL: /%url%/,
  UPLOAD_NAME: /%orig%/,
  NUMBER: /%num%/,
};

export const LABEL = {
  CHANNEL: '채널 이름',
  CHANNEL_ID: '채널 SLUG',
  TITLE: '게시물 제목',
  CATEGORY: '게시물 글머리',
  AUTHOR: '게시물 작성자',
  ARTICLE_ID: '게시물 번호',
  URL: '게시물 URL',
  UPLOAD_NAME: '이미지 업로드 명',
  NUMBER: '이미지 번호',
};

/**
 * 패턴이 일치하는 string을 변환합니다.
 *
 * @param {string} string             변환을 시도할 문자열
 * @param {Object} option             변환 옵션
 * @param {Object} option.values      util/Parser/useParser()으로 받은 값
 * @param {Number} option.index       인덱스 번호
 * @param {string} option.fileName    업로드 된 파일의 실제 이름
 * @returns
 */
export default function format(string, { values, index = 0, fileName = '' }) {
  const { channel, article } = values;

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
