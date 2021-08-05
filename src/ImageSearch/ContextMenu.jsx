import React, { useCallback } from 'react';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

import fetch from '../$Common/Fetch';

import ContextMenuGroup from '../$ContextMenu/ContextMenuGroup';

export default function ContextMenu({ data, onClose, setSnack }) {
  const handleGoogle = useCallback(() => {
    window.open(
      `https://www.google.com/searchbyimage?safe=off&image_url=${data.orig}`,
    );
    onClose();
  }, [data.orig, onClose]);

  const handleYandex = useCallback(() => {
    window.open(
      `https://yandex.com/images/search?rpt=imageview&url=${data.orig}`,
    );
    onClose();
  }, [data.orig, onClose]);

  const handleSauceNao = useCallback(() => {
    (async () => {
      try {
        onClose();
        setSnack('SauceNao에서 검색 중...');
        const { response: blob } = await fetch({
          url: data.orig,
          timeout: 10000,
          responseType: 'blob',
        });

        if (blob.size > 15728640) {
          setSnack('업로드 용량 제한(15MB)을 초과했습니다.');
          return;
        }

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('frame', 1);
        formdata.append('database', 999);

        const { response } = await fetch({
          url: 'https://saucenao.com/search.php',
          method: 'POST',
          data: formdata,
          responseType: 'document',
        });
        const resultURL = response
          .querySelector('#yourimage a')
          ?.href.split('image=')[1];
        if (!resultURL) {
          setSnack('이미지 업로드에 실패했습니다.');
          return;
        }
        window.open(
          `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${resultURL}`,
        );
        setSnack('');
      } catch (error) {
        setSnack(
          '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
        );
        console.error(error);
      }
    })();
  }, [data.orig, onClose, setSnack]);

  const handleTwigaten = useCallback(() => {
    (async () => {
      try {
        onClose();
        setSnack('TwiGaTen에서 검색 중...');
        const { response: blob } = await fetch({
          url: data.orig,
          timeout: 10000,
          responseType: 'blob',
        });

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);

        const { finalUrl: resultURL } = await fetch({
          url: 'https://twigaten.204504byse.info/search/media',
          method: 'POST',
          data: formdata,
        });
        window.open(resultURL);
        setSnack('');
      } catch (error) {
        setSnack(
          '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
        );
        console.error(error);
      }
    })();
  }, [data.orig, onClose, setSnack]);

  const handleAscii2D = useCallback(() => {
    (async () => {
      try {
        onClose();
        setSnack('Ascii2D에서 검색 중...');
        const { response: blob } = await fetch({
          url: data.orig,
          timeout: 10000,
          responseType: 'blob',
        });

        const { response: tokenDocument } = await fetch({
          url: 'https://ascii2d.net',
          responseType: 'document',
        });
        const token = tokenDocument.querySelector(
          'input[name="authenticity_token"]',
        )?.value;
        if (!token) {
          setSnack('Ascii2d 검색 토큰 획득 실패');
          return;
        }

        const formdata = new FormData();
        formdata.append('file', blob, `image.${blob.type.split('/')[1]}`);
        formdata.append('utf8', '✓');
        formdata.append('authenticity_token', token);

        const { finalUrl: resultURL } = await fetch({
          url: 'https://ascii2d.net/search/file',
          method: 'POST',
          data: formdata,
        });
        window.open(resultURL);
        setSnack('');
      } catch (error) {
        setSnack(
          '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
        );
        console.error(error);
      }
    })();
  }, [data.orig, onClose, setSnack]);

  return (
    <ContextMenuGroup>
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
    </ContextMenuGroup>
  );
}
