import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import { ARTICLE_IMAGES } from 'core/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { request } from 'func/http';
import { open } from 'func/window';

import { convertToPng } from 'func/image';
import info from '../info';

const ERROR_MSG =
  '오류가 발생했습니다. 개발자 도구(F12)의 콘솔 창을 확인 바랍니다.';

async function openWithForm(
  searchUrl,
  { inputSelector = 'input', imageUrl, blob },
) {
  if (!searchUrl) throw Error('검색 사이트 지정 안됨');

  const targetUrl = new URL(searchUrl);

  // 사이트 검색 input 추출
  const inputList = await request(targetUrl.origin, {
    responseType: 'document',
  }).then(({ response }) => [...response.querySelectorAll(inputSelector)]);

  // 폼 생성
  const form = document.createElement('form');
  form.style.position = 'absolute';
  form.style.left = '-9999px';

  // 전송 설정
  form.method = 'POST';
  form.action = targetUrl;
  form.enctype = 'multipart/form-data';
  form.target = '_blank';

  for (const input of inputList) {
    // 파일 첨부
    if (blob && input.type === 'file') {
      const convertedBlob = await convertToPng(blob);
      const type = convertedBlob.type;
      const ext = type.split('/')[1];
      const file = new File([convertedBlob], `image.${ext}`, { type });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    }

    // URL 입력
    if (imageUrl && input.type === 'url') {
      input.value = imageUrl;
    }

    form.append(input);
  }

  document.body.append(form);
  form.submit();
  form.remove();
}

function ImageSearch({ target, closeMenu }) {
  const setSnack = useSnackbarAlert();

  const {
    // 동작
    contextMenuEnabled,
    openType,
    searchBySource,
    searchGoogleMethod,
    // 사이트
    showGoogle,
    showYandex,
    showSauceNao,
    showIqdb,
    showAscii2D,
    showTraceMoe,
    showImgOps,
    showTinEye,
  } = useSelector((state) => state[info.id].storage);

  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: contextMenuEnabled ? ARTICLE_IMAGES : 'NULL',
  });

  const data = useMemo(() => {
    if (!target) return null;

    return `${target.src}${searchBySource ? '&type=orig' : ''}`;
  }, [target, searchBySource]);

  const handleGoogle = useCallback(() => {
    if (!showGoogle) return;

    const url = {
      lens: 'https://lens.google.com/uploadbyurl?hl=ko&re=df&st=1668437351496&ep=gsbubu&url=',
      source: 'https://www.google.com/searchbyimage?client=app&image_url=',
    };
    open(`${url[searchGoogleMethod]}${encodeURIComponent(data)}`, openType);
    closeMenu();
  }, [showGoogle, data, searchGoogleMethod, openType, closeMenu]);

  const handleYandex = useCallback(() => {
    if (!showYandex) return;

    open(
      `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(
        data,
      )}`,
      openType,
    );
    closeMenu();
  }, [showYandex, closeMenu, data, openType]);

  const handleSauceNao = useCallback(() => {
    if (!showSauceNao) return;

    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'SauceNao에서 검색 중...' });
        const blob = await request(data, {
          responseType: 'blob',
        }).then(({ response }) => response);

        if (blob.size > 15728640) {
          setSnack({
            msg: '업로드 용량 제한(15MB)을 초과했습니다.',
            time: 3000,
          });
          return;
        }

        await openWithForm('https://saucenao.com/search.php', { blob });
        setSnack();
      } catch (error) {
        setSnack({
          msg: ERROR_MSG,
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [showSauceNao, data, closeMenu, setSnack]);

  const handleIqdb = useCallback(() => {
    if (!showIqdb) return;

    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'IQDB에서 검색 중...' });
        const blob = await request(data, {
          responseType: 'blob',
        }).then(({ response }) => response);

        if (blob.size > 8388608) {
          setSnack({
            msg: '업로드 용량 제한(8MB)을 초과했습니다.',
            time: 3000,
          });
          return;
        }

        await openWithForm('https://iqdb.org/', { blob });
        setSnack();
      } catch (error) {
        setSnack({
          msg: ERROR_MSG,
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [showIqdb, data, closeMenu, setSnack]);

  const handleAscii2D = useCallback(() => {
    if (!showAscii2D) return;

    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'Ascii2D에서 검색 중...' });

        await openWithForm('https://ascii2d.net/search/uri', {
          imageUrl: data,
          inputSelector: 'form:not(#file_upload) input',
        });
        setSnack();
      } catch (error) {
        setSnack({
          msg: ERROR_MSG,
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [showAscii2D, data, closeMenu, setSnack]);

  const handleTraceMoe = useCallback(() => {
    if (!showTraceMoe) return;

    open(`https://trace.moe/?url=${encodeURIComponent(data)}`, openType);
    closeMenu();
  }, [showTraceMoe, closeMenu, data, openType]);

  const handleImgOps = useCallback(() => {
    if (!showImgOps) return;

    open(`https://imgops.com/${data}`, openType);
    closeMenu();
  }, [showImgOps, closeMenu, data, openType]);

  const handleTinEye = useCallback(() => {
    if (!showTinEye) return;

    open(`https://tineye.com/search?url=${encodeURIComponent(data)}`, openType);
    closeMenu();
  }, [showTinEye, closeMenu, data, openType]);

  const handleAllOpen = useCallback(() => {
    handleGoogle();
    handleYandex();
    handleSauceNao();
    handleIqdb();
    handleAscii2D();
    handleTraceMoe();
    handleImgOps();
    handleTinEye();
  }, [
    handleGoogle,
    handleYandex,
    handleSauceNao,
    handleIqdb,
    handleAscii2D,
    handleTraceMoe,
    handleImgOps,
    handleTinEye,
  ]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleAllOpen}>
        <ListItemIcon>
          <PhotoLibraryIcon />
        </ListItemIcon>
        <Typography>모든 사이트로 검색</Typography>
      </MenuItem>
      {showGoogle && (
        <MenuItem onClick={handleGoogle}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>Google 검색</Typography>
        </MenuItem>
      )}
      {showYandex && (
        <MenuItem onClick={handleYandex}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>Yandex 검색</Typography>
        </MenuItem>
      )}
      {showSauceNao && (
        <MenuItem onClick={handleSauceNao}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>SauceNao 검색</Typography>
        </MenuItem>
      )}
      {showIqdb && (
        <MenuItem onClick={handleIqdb}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>IQDB 검색</Typography>
        </MenuItem>
      )}
      {showAscii2D && (
        <MenuItem onClick={handleAscii2D}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>Ascii2D 검색</Typography>
        </MenuItem>
      )}
      {showTraceMoe && (
        <MenuItem onClick={handleTraceMoe}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>TraceMoe 검색</Typography>
        </MenuItem>
      )}
      {showImgOps && (
        <MenuItem onClick={handleImgOps}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>ImgOps 검색</Typography>
        </MenuItem>
      )}
      {showTinEye && (
        <MenuItem onClick={handleTinEye}>
          <ListItemIcon>
            <ImageSearchIcon />
          </ListItemIcon>
          <Typography>TinEye 검색</Typography>
        </MenuItem>
      )}
    </List>
  );
}

ImageSearch.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ImageSearch;
