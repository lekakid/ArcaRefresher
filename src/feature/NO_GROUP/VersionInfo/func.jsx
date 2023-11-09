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
 * @param {string} script  적용 중인 스크립트 버전 스트링
 * @param {string} storage  마지막으로 확인한 버전 스트링
 * @returns                 값이 양수라면 업데이트 확인 필요, 음수라면 새로고침이 필요함
 */
export function compare(script, storage) {
  const scriptVersion = parse(script);
  const storageVersion = parse(storage);

  if (scriptVersion.major !== storageVersion.major) {
    return scriptVersion.major - storageVersion.major;
  }
  if (scriptVersion.minor !== storageVersion.minor) {
    return scriptVersion.minor - storageVersion.minor;
  }
  return scriptVersion.patch - storageVersion.patch;
}
