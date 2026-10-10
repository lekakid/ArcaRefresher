import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { downloadZip } from 'client-zip';
import streamSaver from 'streamsaver';

import { useContent } from 'hooks/Content';

import { request } from 'func/http';
import { format } from './Util';
import Info from './FeatureInfo';

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
  } = useSelector((state) => state[Info.id].storage);

  useEffect(() => {
    if (infoList.length === 0) return;

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

    // 파일 저장 스트림 생성
    const zipFileName = format(zipName, { content: contentInfo });
    const filestream = streamSaver.createWriteStream(
      `${zipFileName}.${zipExtension}`,
    );

    // 다운로드 스트림 제너레이터 선언
    async function* entries() {
      // 페이지 이탈 방지
      window.addEventListener('beforeunload', confirm);

      onDownloadStart();

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
        const isGif = ext === 'gif';

        count += 1;
        try {
          const stream = new ReadableStream({
            async pull(controller) {
              const blob = (
                await request(downloadOrigin || isGif ? orig : url, {
                  responseType: 'blob',
                })
              ).response;
              controller.enqueue(new Uint8Array(await blob.arrayBuffer()));
              controller.close();
            },
          });

          yield { name: `${imageName}.${ext}`, input: stream };
        } catch (error) {
          console.warn('[ImageDownloader] 이미지를 받지 못했습니다.', error);
        }
      }

      // 페이지 이탈 방지 해제
      window.removeEventListener('beforeunload', confirm);
    }

    // 다운로드 스트림 생성 후 연결
    const zipstream = downloadZip(entries());
    zipstream.body.pipeTo(filestream);
  }, [
    infoList,
    downloadOrigin,
    startWithZero,
    zipExtension,
    zipImageName,
    zipName,
    contentInfo,
    onDownloadStart,
  ]);

  return null;
}

DownloadWidget.propTypes = {
  infoList: PropTypes.array,
  onDownloadStart: PropTypes.func,
};

export default DownloadWidget;
