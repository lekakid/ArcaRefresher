import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { downloadZip } from 'client-zip';

import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { request } from 'func/http';
import { saveStream } from 'func/file';

import { format } from './Util';
import info from './info';

function DownloadWidget({ infoList, onDownloadStart }) {
  const contentInfo = useContent();
  const {
    // 동작 설정
    downloadOrigin,
    // 파일 포맷
    startWithZero,
    zipImageName,
    zipName,
    zipExtension,
  } = useSelector((state) => state[info.id].storage);
  const setSnack = useSnackbarAlert();

  useEffect(() => {
    if (infoList.length === 0) return;

    const confirm = (event) => {
      event.preventDefault();
      const message =
        '지금 창을 닫으면 다운로드가 중단됩니다. 계속하시겠습니까?';
      event.returnValue = message;
      return message;
    };

    const zipFileName = format(zipName, { content: contentInfo });

    // 다운로드 스트림 제너레이터 선언
    async function* entries() {
      // 페이지 이탈 방지
      window.addEventListener('beforeunload', confirm);

      try {
        onDownloadStart();
        setSnack({ msg: '이미지를 다운로드하는 중...' });

        // 파일명 중복 시 끝에 숫자 붙이는 용도
        const dupCount = {};

        // 다운로드 시작
        for (let i = 0; i < infoList.length; i += 1) {
          const info = infoList[i];
          const { url, orig, ext, name } = info;

          let imageName = format(zipImageName, {
            content: contentInfo,
            index: startWithZero ? i : i + 1,
            name,
          });
          imageName =
            dupCount[imageName] > 0
              ? `${imageName}(${dupCount[imageName]})`
              : imageName;
          dupCount[imageName] = (dupCount[imageName] || 0) + 1;
          const isGif = ext === 'gif';

          try {
            const targetUrl = downloadOrigin || isGif ? orig : url;
            const blob = await request(targetUrl, {
              responseType: 'blob',
            }).then(({ response }) => response);

            yield { name: `${imageName}.${ext}`, input: blob };
          } catch (error) {
            console.warn('[ImageDownloader] 이미지를 받지 못했습니다.', error);
          }
        }
      } finally {
        // 페이지 이탈 방지 해제
        window.removeEventListener('beforeunload', confirm);
      }
    }

    saveStream(`${zipFileName}.${zipExtension}`, downloadZip(entries()).body)
      .then(() => setSnack())
      .catch((error) => {
        console.warn('[ImageDownloader] 다운로드가 중단되었습니다.', error);
        setSnack({ msg: '이미지 다운로드에 실패했습니다.', time: 3000 });
      });
  }, [
    infoList,
    downloadOrigin,
    startWithZero,
    zipExtension,
    zipImageName,
    zipName,
    contentInfo,
    onDownloadStart,
    setSnack,
  ]);

  return null;
}

DownloadWidget.propTypes = {
  infoList: PropTypes.array,
  onDownloadStart: PropTypes.func,
};

export default DownloadWidget;
