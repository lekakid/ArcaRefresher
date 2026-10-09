import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { ImageSearch, PhotoLibrary } from '@mui/icons-material';

import { ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { request } from 'func/http';
import { open } from 'func/window';

import { convertToPng } from 'func/image';
import Info from '../FeatureInfo';

const ERROR_MSG =
  '오류가 발생했습니다. 개발자 도구(F12)의 콘솔 창을 확인 바랍니다.';

function ContextMenu({ target, closeMenu }) {
  const {
    // 동작
    contextMenuEnabled,
    openType,
    searchBySource,
    searchGoogleMethod,
    // 사이트
    showGoogle,
    showBing,
    showYandex,
    showSauceNao,
    showIqdb,
    showAscii2D,
    showTraceMoe,
    showImgOps,
    showTinEye,
  } = useSelector((state) => state[Info.id].storage);

  const setSnack = useSnackbarAlert();
  const data = useContextMenu(
    {
      key: Info.id,
      selector: contextMenuEnabled ? ARTICLE_IMAGES : 'NULL',
      dataExtractor: () => {
        if (!target) return undefined;

        return `${target.src}${searchBySource ? '&type=orig' : ''}`;
      },
    },
    [target, searchBySource],
  );

  const handleGoogle = useCallback(() => {
    if (!showGoogle) return;

    const url = {
      lens: 'https://lens.google.com/uploadbyurl?hl=ko&re=df&st=1668437351496&ep=gsbubu&url=',
      source: 'https://www.google.com/searchbyimage?client=app&image_url=',
    };
    open(`${url[searchGoogleMethod]}${encodeURIComponent(data)}`, openType);
    closeMenu();
  }, [showGoogle, data, searchGoogleMethod, openType, closeMenu]);

  const handleBing = useCallback(() => {
    if (!showBing) return;

    open(
      `https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=SBIHMP&sbisrc=UrlPaste&idpbck=1&q=imgurl:${encodeURIComponent(
        data,
      )}`,
      openType,
    );
    closeMenu();
  }, [showBing, data, openType, closeMenu]);

  const handleYandex = useCallback(() => {
    if (!showYandex) return;

    GM_openInTab(
      `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(
        data,
      )}`,
    );
    closeMenu();
  }, [showYandex, closeMenu, data]);

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

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(
          new File([blob], `image.${blob.type.split('/')[1]}`, {
            type: blob.type,
          }),
        );

        const form = document.createElement('form');
        form.style.position = 'absolute';
        form.style.left = '-9999px';

        form.method = 'POST';
        form.action = 'https://saucenao.com/search.php';
        form.enctype = 'multipart/form-data';
        form.target = '_blank';

        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'file';
        input.files = dataTransfer.files;
        form.append(input);

        document.body.append(form);
        form.submit();
        form.remove();

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

        const inputList = await request('https://iqdb.org/').then(
          ({ response }) => [...response.querySelectorAll('input')],
        );

        const convertedBlob = await convertToPng(blob);
        const file = new File(
          [convertedBlob],
          `image.${convertedBlob.type.split('/')[1]}`,
          {
            type: convertedBlob.type,
          },
        );
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const form = document.createElement('form');
        form.style.position = 'absolute';
        form.style.left = '-9999px';

        form.method = 'POST';
        form.action = 'https://iqdb.org/';
        form.enctype = 'multipart/form-data';
        form.target = '_blank';

        for (let i = 0; i < inputList.length; i += 1) {
          const input = inputList[i];
          if (input.type === 'file') {
            input.files = dataTransfer.files;
          }
          form.append(input);
        }

        document.body.append(form);
        form.submit();
        form.remove();

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
        const inputList = await request('https://ascii2d.net/').then(
          ({ response }) => [
            ...response.querySelectorAll('form:not(#file_upload) input'),
          ],
        );

        const form = document.createElement('form');
        form.style.position = 'absolute';
        form.style.left = '-9999px';

        form.method = 'POST';
        form.action = 'https://ascii2d.net/search/uri';
        form.enctype = 'multipart/form-data';
        form.target = '_blank';

        for (let i = 0; i < inputList.length; i += 1) {
          const input = inputList[i];
          if (input.type === 'url') {
            input.value = data;
          }
          form.append(input);
        }

        document.body.append(form);
        form.submit();
        form.remove();

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

    GM_openInTab(
      `https://trace.moe/?url=${encodeURIComponent(data)}`,
      openType,
    );
    closeMenu();
  }, [showTraceMoe, closeMenu, data, openType]);

  const handleImgOps = useCallback(() => {
    if (!showImgOps) return;

    GM_openInTab(`https://imgops.com/${data}`, openType);
    closeMenu();
  }, [showImgOps, closeMenu, data, openType]);

  const handleTinEye = useCallback(() => {
    if (!showTinEye) return;

    GM_openInTab(
      `https://tineye.com/search?url=${encodeURIComponent(data)}`,
      openType,
    );
    closeMenu();
  }, [showTinEye, closeMenu, data, openType]);

  const handleAllOpen = useCallback(() => {
    handleGoogle();
    handleBing();
    handleYandex();
    handleSauceNao();
    handleIqdb();
    handleTraceMoe();
    handleImgOps();
    handleTinEye();
  }, [
    handleGoogle,
    handleBing,
    handleYandex,
    handleSauceNao,
    handleIqdb,
    handleTraceMoe,
    handleImgOps,
    handleTinEye,
  ]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleAllOpen}>
        <ListItemIcon>
          <PhotoLibrary />
        </ListItemIcon>
        <Typography>모든 사이트로 검색</Typography>
      </MenuItem>
      {showGoogle && (
        <MenuItem onClick={handleGoogle}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>Google 검색</Typography>
        </MenuItem>
      )}
      {showBing && (
        <MenuItem onClick={handleBing}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>Bing 검색</Typography>
        </MenuItem>
      )}
      {showYandex && (
        <MenuItem onClick={handleYandex}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>Yandex 검색</Typography>
        </MenuItem>
      )}
      {showSauceNao && (
        <MenuItem onClick={handleSauceNao}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>SauceNao 검색</Typography>
        </MenuItem>
      )}
      {showIqdb && (
        <MenuItem onClick={handleIqdb}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>IQDB 검색</Typography>
        </MenuItem>
      )}
      {showAscii2D && (
        <MenuItem onClick={handleAscii2D}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>Ascii2D 검색</Typography>
        </MenuItem>
      )}
      {showTraceMoe && (
        <MenuItem onClick={handleTraceMoe}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>TraceMoe 검색</Typography>
        </MenuItem>
      )}
      {showImgOps && (
        <MenuItem onClick={handleImgOps}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>ImgOps 검색</Typography>
        </MenuItem>
      )}
      {showTinEye && (
        <MenuItem onClick={handleTinEye}>
          <ListItemIcon>
            <ImageSearch />
          </ListItemIcon>
          <Typography>TinEye 검색</Typography>
        </MenuItem>
      )}
    </List>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
