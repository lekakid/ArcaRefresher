import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

import { ARTICLE_IMAGES } from 'core/selector';
import { setClose, setContextSnack } from 'menu/ContextMenu/slice';
import fetch from 'util/fetch';

import { MODULE_ID } from './ModuleInfo';

function ContextMenu({ triggerList }) {
  const { saucenaoBypass } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();
  const data = useRef(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const trigger = (target) => {
      if (!target.closest(ARTICLE_IMAGES)) {
        data.current = null;
        setValid(false);
        return false;
      }

      const url = target.src.split('?')[0];
      const orig = `${url}${
        target.tagName === 'VIDEO' ? '.gif' : ''
      }?type=orig`;
      data.current = orig;
      setValid(true);
      return true;
    };

    triggerList.current.push(trigger);
  }, [triggerList]);

  const handleGoogle = useCallback(() => {
    window.open(
      `https://www.google.com/searchbyimage?safe=off&image_url=${data.current}`,
    );
    dispatch(setClose());
  }, [dispatch]);

  const handleYandex = useCallback(() => {
    window.open(
      `https://yandex.com/images/search?rpt=imageview&url=${data.current}`,
    );
    dispatch(setClose());
  }, [dispatch]);

  const handleSauceNao = useCallback(() => {
    if (!saucenaoBypass) {
      window.open(`https://saucenao.com/search.php?db=999&url=${data.current}`);
      dispatch(setClose());
      return;
    }

    (async () => {
      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: 'SauceNao에서 검색 중...' }));
        const { response: blob } = await fetch({
          url: data.current,
          timeout: 10000,
          responseType: 'blob',
        });

        if (blob.size > 15728640) {
          dispatch(
            setContextSnack({
              msg: '업로드 용량 제한(15MB)을 초과했습니다.',
              time: 3000,
            }),
          );
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
          dispatch(
            setContextSnack({
              msg: '이미지 업로드에 실패했습니다.',
              time: 3000,
            }),
          );
          return;
        }
        window.open(
          `https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${resultURL}`,
        );
        dispatch(setContextSnack(''));
      } catch (error) {
        dispatch(
          setContextSnack({
            msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
            time: 3000,
          }),
        );
        console.error(error);
      }
    })();
  }, [saucenaoBypass, dispatch]);

  const handleTwigaten = useCallback(() => {
    (async () => {
      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: 'TwiGaTen에서 검색 중...' }));
        const { response: blob } = await fetch({
          url: data.current,
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
        dispatch(setContextSnack(''));
      } catch (error) {
        dispatch(
          setContextSnack({
            msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
            time: 3000,
          }),
        );
        console.error(error);
      }
    })();
  }, [dispatch]);

  const handleAscii2D = useCallback(() => {
    (async () => {
      try {
        dispatch(setClose());
        dispatch(setContextSnack({ msg: 'Ascii2D에서 검색 중...' }));
        const { response: blob } = await fetch({
          url: data.current,
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
          dispatch(
            setContextSnack({
              msg: 'Ascii2d 검색 토큰 획득 실패',
              time: 3000,
            }),
          );
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
        dispatch(setContextSnack(''));
      } catch (error) {
        dispatch(
          setContextSnack({
            msg: '오류가 발생했습니다. 개발자 도구(F12)의 콘솔창을 확인바랍니다.',
            time: 3000,
          }),
        );
        console.error(error);
      }
    })();
  }, [dispatch]);

  if (!valid) return null;
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
