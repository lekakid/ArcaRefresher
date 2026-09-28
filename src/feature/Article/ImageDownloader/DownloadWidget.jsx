import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Writer } from '@transcend-io/conflux';
import streamSaver from 'streamsaver';

import { useContent } from 'hooks/Content';

import { request } from 'func/http';
import { format } from './Util';
import Info from './FeatureInfo';

function DownloadWidget({ infoList }) {
  const contentInfo = useContent();
  const {
    // 동작 설정
    downloadOrigin,
    // 파일 포맷
    startWithZero,
    zipImageName,
    zipName,
    zipExtension,
  } = useSelector((state) => state[Info.id].storage);

  useEffect(() => {
    if (infoList.length === 0) return;

    async function download() {
      const confirm = (event) => {
        event.preventDefault();
        const message =
          '지금 창을 닫으면 다운로드가 중단됩니다. 계속하시겠습니까?';
        event.returnValue = message;
        return message;
      };

      let count = startWithZero ? 0 : 1;
      // 파일명 중복 시 끝에 숫자 붙이는 용도
      const dupCount = {};

      // 페이지 이탈 방지
      window.addEventListener('beforeunload', confirm);

      // Conflux 압축파일 스트림 생성
      const { readable, writable } = new Writer();
      const writer = writable.getWriter();

      // 파일 저장 스트림 생성
      const zipFileName = format(zipName, { content: contentInfo });
      const filestream = streamSaver.createWriteStream(
        `${zipFileName}.${zipExtension}`,
      );

      // Conflux -> streamSaver 연결
      readable.pipeTo(filestream);

      // 다운로드 시작
      for (let i = 0; i < infoList.length; i += 1) {
        const info = infoList[i];

        const { url, orig, ext, name } = info;

        let imageName = format(zipImageName, {
          content: contentInfo,
          index: count,
          name,
        });
        imageName =
          dupCount[imageName] > 0
            ? `${imageName}(${dupCount[imageName]})`
            : imageName;
        dupCount[imageName] = (dupCount[imageName] || 0) + 1;

        count += 1;
        try {
          // eslint-disable-next-line no-await-in-loop
          const stream = await request(downloadOrigin ? orig : url, {
            responseType: 'blob',
          }).then(({ response }) => response.stream());

          writer.write({
            name: `${imageName}.${ext}`,
            stream: () => stream,
          });
        } catch (error) {
          console.warn('[ImageDownloader] 이미지를 받지 못했습니다.', error);
        }
      }

      // 스트림 종료
      writer.close();

      // 페이지 이탈 방지 해제
      window.removeEventListener('beforeunload', confirm);
    }
    download();
  }, [
    infoList,
    downloadOrigin,
    startWithZero,
    zipExtension,
    zipImageName,
    zipName,
    contentInfo,
  ]);

  return null;
}

DownloadWidget.propTypes = {
  infoList: PropTypes.array,
};

export default DownloadWidget;
