import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { ImageSearch, PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { request } from 'func/http';

import Info from './FeatureInfo';

const ERROR_MSG =
  '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.';

function ContextMenu({ targetRef }) {
  const {
    storage: { searchBySource, saucenaoBypass },
  } = useSelector((state) => state[Info.ID]);

  const setSnack = useContextSnack();
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: ARTICLE_IMAGES,
    dataExtractor: (target) =>
      `${target.src}${searchBySource ? '&type=orig' : ''}`,
  });

  const handleGoogle = useCallback(() => {
    GM_openInTab(
      `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(
        data,
      )}&hl=ko&re=df&st=1668437351496&ep=gsbubu`,
    );
    closeMenu();
  }, [closeMenu, data]);

  const handleYandex = useCallback(() => {
    GM_openInTab(
      `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(
        data,
      )}`,
    );
    closeMenu();
  }, [closeMenu, data]);

  const handleSauceNao = useCallback(() => {
    if (!saucenaoBypass) {
      GM_openInTab(
        `https://saucenao.com/search.php?db=999&url=${encodeURIComponent(
          data,
        )}`,
      );
      closeMenu();
      return;
    }

    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'SauceNao에서 검색 중...' });
        const blob = await fetch(data).then((response) => response.blob());

        if (blob.size > 15728640) {
          setSnack({
            msg: '업로드 용량 제한(15MB)을 초과했습니다.',
            time: 3000,
          });
          return;
        }

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('frame', 1);
        formdata.append('database', 999);

        const resultURL = await request('https://saucenao.com/search.php', {
          method: 'POST',
          data: formdata,
        }).then(
          ({ response }) =>
            response.querySelector('#yourimage a')?.href.split('image=')[1],
        );
        if (!resultURL) {
          setSnack({
            msg: '이미지 업로드에 실패했습니다.',
            time: 3000,
          });
          return;
        }
        setSnack();
        GM_openInTab(
          `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${resultURL}`,
        );
      } catch (error) {
        setSnack({
          msg: ERROR_MSG,
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [saucenaoBypass, data, closeMenu, setSnack]);

  const handleIqdb = useCallback(() => {
    GM_openInTab(`https://iqdb.org/?url=${encodeURIComponent(data)}`);
    closeMenu();
  }, [closeMenu, data]);

  const handleAscii2D = useCallback(() => {
    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'Ascii2D에서 검색 중...' });

        const token = await request('https://ascii2d.net').then(
          ({ response }) =>
            response.querySelector('input[name="authenticity_token"]')?.value,
        );
        if (!token) throw new Error('Ascii2d 검색 토큰 획득 실패');

        const formdata = new FormData();
        formdata.append('utf8', '✓');
        formdata.append('authenticity_token', token);
        formdata.append('uri', data);

        const resultURL = await request('https://ascii2d.net/search/uri', {
          method: 'POST',
          data: formdata,
        }).then(({ finalUrl }) => finalUrl);
        setSnack();
        GM_openInTab(resultURL);
      } catch (error) {
        setSnack({
          msg: ERROR_MSG,
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [closeMenu, data, setSnack]);

  const handleAllOpen = useCallback(() => {
    handleGoogle();
    handleYandex();
    handleSauceNao();
    handleIqdb();
    handleAscii2D();
  }, [handleAscii2D, handleGoogle, handleIqdb, handleSauceNao, handleYandex]);

  if (!data) return null;
  return (
    <List>
      <MenuItem onClick={handleAllOpen}>
        <ListItemIcon>
          <PhotoLibrary />
        </ListItemIcon>
        <Typography>모든 사이트로 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleGoogle}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>Google 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleYandex}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>Yandex 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleSauceNao}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>SauceNao 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleIqdb}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>IQDB 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleAscii2D}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>Ascii2D 검색</Typography>
      </MenuItem>
    </List>
  );
}

ContextMenu.sortOrder = 100;

export default ContextMenu;
