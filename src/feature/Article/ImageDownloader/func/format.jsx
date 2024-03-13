export const FORMAT = {
  CHANNEL: {
    STRING: '%channel%',
    REGEX: /%channel%/,
    LABEL: '채널 이름',
    getValue: (args) => args.content.channel.name,
  },
  CHANNEL_ID: {
    STRING: '%channelId%',
    REGEX: /%channelI(D|d)%/,
    LABEL: '채널 SLUG',
    getValue: (args) => args.content.channel.id,
  },
  TITLE: {
    STRING: '%title%',
    REGEX: /%title%/,
    LABEL: '게시물 제목',
    getValue: (args) => args.content.article.title,
  },
  CATEGORY: {
    STRING: '%category%',
    REGEX: /%category%/,
    LABEL: '게시물 글머리',
    getValue: (args) => args.content.article.category,
  },
  AUTHOR: {
    STRING: '%author%',
    REGEX: /%author%/,
    LABEL: '게시물 작성자',
    getValue: (args) => args.content.article.author,
  },
  ARTICLE_ID: {
    STRING: '%articleId%',
    REGEX: /%articleI(D|d)%/,
    LABEL: '게시물 번호',
    getValue: (args) => args.content.article.id,
  },
  URL: {
    STRING: '%url%',
    REGEX: /%url%/,
    LABEL: '게시물 URL',
    getValue: (args) => args.content.article.url,
  },
  ORIG: {
    STRING: '%orig%',
    REGEX: /%orig%/,
    LABEL: '이미지 업로드 명',
    getValue: (args) => args.fileName || '',
  },
  NUMBER: {
    STRING: '%num%',
    REGEX: /%num%/,
    LABEL: '이미지 번호',
    getValue: (args) => `${args.index}`.padStart(3, '0'),
  },
};

/**
 * 패턴이 일치하는 string을 변환합니다.
 *
 * @param {string} formatStr             포맷 스트링을 포함한 문자열
 * @param {Object} args             치환할 문자열
 * @param {Object} args.content     util/Content/useContent()으로 받은 값
 * @param {Number} args.index       인덱스 번호
 * @param {string} args.fileName    업로드 된 파일의 실제 이름
 * @returns
 */

export default function format(formatStr, args) {
  let result = formatStr;
  Object.values(FORMAT).forEach(({ REGEX, getValue }) => {
    result = result.replace(REGEX, getValue(args));
  });

  return result;
}
