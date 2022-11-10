import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu, useContextSnack } from 'menu/ContextMenu';
import { httpRequest } from 'func/httpRequest';
import { getArcaMediaURL } from 'func/url';

import Info from './FeatureInfo';

function ContextMenu({ targetRef }) {
  const {
    storage: { searchBySource, saucenaoBypass },
  } = useSelector((state) => state[Info.ID]);

  const setSnack = useContextSnack();
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: ARTICLE_IMAGES,
    dataExtractor: (target) => {
      const url = target.src.split('?')[0];
      return getArcaMediaURL(url, searchBySource ? 'orig' : '');
    },
  });

  const handleGoogle = useCallback(() => {
    window.open(
      `https://www.google.com/searchbyimage?safe=off&image_url=${data}`,
    );
    closeMenu();
  }, [closeMenu, data]);

  const handleYandex = useCallback(() => {
    window.open(`https://yandex.com/images/search?rpt=imageview&url=${data}`);
    closeMenu();
  }, [closeMenu, data]);

  const handleSauceNao = useCallback(() => {
    if (!saucenaoBypass) {
      window.open(`https://saucenao.com/search.php?db=999&url=${data}`);
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

        const { response } = await httpRequest({
          url: 'https://saucenao.com/search.php',
          method: 'POST',
          data: formdata,
          responseType: 'document',
        });
        const resultURL = response
          .querySelector('#yourimage a')
          ?.href.split('image=')[1];
        if (!resultURL) {
          setSnack({
            msg: '이미지 업로드에 실패했습니다.',
            time: 3000,
          });
          return;
        }
        window.open(
          `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${resultURL}`,
        );
        setSnack({});
      } catch (error) {
        setSnack({
          msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [saucenaoBypass, data, closeMenu, setSnack]);

  const handleTwigaten = useCallback(() => {
    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'TwiGaTen에서 검색 중...' });
        const blob = await fetch(data).then((response) => response.blob());

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);

        const { finalUrl: resultURL } = await httpRequest({
          url: 'https://twigaten.204504byse.info/search/media',
          method: 'POST',
          data: formdata,
        });
        window.open(resultURL);
        setSnack({});
      } catch (error) {
        setSnack({
          msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [closeMenu, data, setSnack]);

  const handleAscii2D = useCallback(() => {
    (async () => {
      try {
        closeMenu();
        setSnack({ msg: 'Ascii2D에서 검색 중...' });

        const { response: tokenDocument } = await httpRequest({
          url: 'https://ascii2d.net',
          responseType: 'document',
        });
        const token = tokenDocument.querySelector(
          'input[name="authenticity_token"]',
        )?.value;
        if (!token) throw new Error('Ascii2d 검색 토큰 획득 실패');

        const formdata = new FormData();
        formdata.append('utf8', '✓');
        formdata.append('authenticity_token', token);
        formdata.append('uri', data);

        const { finalUrl: resultURL } = await httpRequest({
          url: 'https://ascii2d.net/search/uri',
          method: 'POST',
          data: formdata,
        });
        window.open(resultURL);
        setSnack({});
      } catch (error) {
        setSnack({
          msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
          time: 3000,
        });
        console.error(error);
      }
    })();
  }, [closeMenu, data, setSnack]);

  if (!data) return null;
  return (
    <List>
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
      <MenuItem onClick={handleTwigaten}>
        <ListItemIcon>
          <ImageSearch />
        </ListItemIcon>
        <Typography>TwitGeTen 검색</Typography>
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

export default ContextMenu;
