export const TYPE_MAJOR = 2;
export const TYPE_MINOR = 1;
export const TYPE_PATCH = 0;
export const TYPE_NONE = 99;

export function parse(versionString) {
  const token = versionString.split('.');
  return {
    major: Number(token[0]),
    minor: Number(token[1]),
    patch: Number(token[2]),
  };
}

export function join({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

/**
 * 적용 중인 스크립트 버전과 마지막으로 확인한 버전을 비교합니다.
 *
 * @param {string} script
 *  적용 중인 스크립트 버전 스트링
 * @param {string} storage
 *  마지막으로 확인한 버전 스트링
 * @returns {{type: (TYPE_MAJOR|TYPE_MINOR|TYPE_PATCH), diff: number}}
 *  TYPE_MAJOR: 2
 *  TYPE_MINOR: 1
 *  TYPE_PATCH: 0
 *
 *  예시)
 *  if(result.type >= TYPE_PATCH)
 */
export function compare(script, storage) {
  const scriptVersion = parse(script);
  const storageVersion = parse(storage);

  if (scriptVersion.major !== storageVersion.major) {
    return {
      type: TYPE_MAJOR,
      diff: scriptVersion.major - storageVersion.major,
    };
  }
  if (scriptVersion.minor !== storageVersion.minor) {
    return {
      type: TYPE_MINOR,
      diff: scriptVersion.minor - storageVersion.minor,
    };
  }
  return {
    type: TYPE_PATCH,
    diff: scriptVersion.patch - storageVersion.patch,
  };
}
