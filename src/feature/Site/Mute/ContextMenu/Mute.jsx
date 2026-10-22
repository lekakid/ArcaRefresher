import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import RedoIcon from '@mui/icons-material/Redo';

import {
  BOARD_ITEMS_WITH_NOTICE,
  USER_INFO,
  USER_MENTION,
} from 'constants/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu/hooks';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { ArcaUser } from 'func/user';
import { useContent } from 'hooks/Content';

import {
  getEmoticonList,
  getBundleId,
  getBundleName,
  trimEmotURL,
} from '../func';
import {
  $addEmoticon,
  $addUser,
  $removeEmoticon,
  $removeUser,
  $setCategoryConfig,
} from '../slice';
import { filterSelector } from '../selector';
import info from '../info';

function makeRegex(id) {
  return `^${id.replace('.', '\\.').replace('*', '\\*')}$`;
}

const USER_SELECTOR = {
  articleItem: `${USER_INFO}, ${USER_MENTION}, ${BOARD_ITEMS_WITH_NOTICE}`,
  nickname: `${USER_INFO}, ${USER_MENTION}`,
};
const EMOTICON_SELECTOR =
  '.article-body .emoticon-wrapper.muted, :is(img, video)[class$="emoticon"]';
const CATEGORY_SELECTOR = '.board-category .item a';

function Mute({ target, closeMenu }) {
  const setSnack = useSnackbarAlert();
  const dispatch = useDispatch();

  const { channel } = useContent();
  const { contextRange, user } = useSelector((state) => state[info.id].storage);
  const filter = useSelector((state) => filterSelector(state, channel.id));

  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: `${USER_SELECTOR[contextRange]}, ${EMOTICON_SELECTOR}, ${CATEGORY_SELECTOR}`,
  });

  const data = useMemo(() => {
    if (!target) return null;

    // 유저 선택
    if (target.matches(USER_SELECTOR[contextRange])) {
      let userElement = target;
      // 게시물 라인 전체가 대상인 경우
      if (target.matches('.vrow')) {
        userElement = target.querySelector('span.user-info');
      }
      // 사용자 정보를 찾지 못함
      if (!userElement) return null;

      const uid = new ArcaUser(userElement).toUID();
      const regex = makeRegex(uid);

      return { type: 'user', uid, regex };
    }

    // 이모티콘을 고른 경우
    if (target.matches(EMOTICON_SELECTOR)) {
      let emoticon = target;

      if (target.matches('.emoticon-wrapper.muted')) {
        emoticon = target.querySelector('[class$="emoticon"]');
      }

      return {
        type: 'emoticon',
        bundleId: emoticon.dataset.storeId,
        emotId: parseInt(emoticon.dataset.id, 10),
        url: trimEmotURL(emoticon.src),
      };
    }

    // 카테고리를 고른 경우
    if (target.matches(CATEGORY_SELECTOR)) {
      const search = new URLSearchParams(target.search);
      const id = decodeURI(search.get('category') || '글머리없음');
      const label =
        id !== '글머리없음' ? target.textContent.trim() : '글머리없음';

      return {
        type: 'category',
        id,
        label,
      };
    }

    return null;
  }, [target, contextRange]);

  const handleMuteEmotBundle = useCallback(() => {
    (async () => {
      try {
        let { bundleId } = data;
        const { emotId, url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }
        const bundleName = await getBundleName(bundleId);
        const { idList, urlList } = await getEmoticonList(bundleId);

        if (idList.length === 0) {
          dispatch(
            $addEmoticon({
              id: bundleId,
              emoticon: {
                name: bundleName,
                bundle: [parseInt(emotId, 10)],
                url: [trimEmotURL(url)],
              },
            }),
          );
        } else {
          dispatch(
            $addEmoticon({
              id: bundleId,
              emoticon: { name: bundleName, bundle: idList, url: urlList },
            }),
          );
        }
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, data, dispatch, setSnack]);

  const handleMuteSingleEmot = useCallback(() => {
    (async () => {
      try {
        let { bundleId, emotId } = data;
        const { url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }
        if (!emotId) {
          const bundle = await getEmoticonList(bundleId);
          const index = bundle.urlList.indexOf(url);
          emotId = bundle.idList[index];
        }
        const bundleName = await getBundleName(bundleId);

        dispatch(
          $addEmoticon({
            id: bundleId,
            emoticon: {
              name: bundleName,
              bundle: [emotId || -1],
              url: [url],
            },
          }),
        );
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, data, dispatch, setSnack]);

  const handleUnmuteEmotBundle = useCallback(() => {
    (async () => {
      try {
        let { bundleId } = data;
        const { emotId } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }

        dispatch(
          $removeEmoticon({
            id: bundleId,
          }),
        );
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, data, dispatch, setSnack]);

  const handleUnmuteSingleEmot = useCallback(() => {
    (async () => {
      try {
        let { bundleId } = data;
        const { emotId, url } = data;
        if (!bundleId) {
          bundleId = await getBundleId(emotId);
        }

        dispatch(
          $removeEmoticon({
            id: bundleId,
            emotId,
            url,
          }),
        );
      } catch (e) {
        setSnack({
          msg: `${e.message}\n개발자 도구(F12)의 콘솔(Console)창 캡쳐와 함께 문의바랍니다.`,
          time: 3000,
        });
        console.error(e);
      }

      closeMenu();
    })();
  }, [closeMenu, data, dispatch, setSnack]);

  const handleUser = useCallback(() => {
    const { regex } = data;
    const exist = user.includes(regex);

    dispatch(exist ? $removeUser(regex) : $addUser(regex));
    closeMenu();
  }, [data, user, dispatch, closeMenu]);

  const handleCategory = useCallback(
    (type) => () => {
      const config = filter.category?.[data.id];

      dispatch(
        $setCategoryConfig({
          channel: channel.id,
          category: data.id,
          config: {
            ...config,
            [type]: !config?.[type],
          },
        }),
      );
      closeMenu();
    },
    [data, filter.category, channel, dispatch, closeMenu],
  );

  if (data?.type === 'emoticon') {
    const muted = target.closest('.muted');

    return (
      <List>
        <MenuItem
          onClick={muted ? handleUnmuteEmotBundle : handleMuteEmotBundle}
        >
          <ListItemIcon>
            <BlockIcon />
          </ListItemIcon>
          <Typography>아카콘 묶음 뮤트{muted ? ' 해제' : ''}</Typography>
        </MenuItem>
        <MenuItem
          onClick={muted ? handleUnmuteSingleEmot : handleMuteSingleEmot}
        >
          <ListItemIcon>
            <BlockIcon />
          </ListItemIcon>
          <Typography>이 아카콘만 뮤트{muted ? ' 해제' : ''}</Typography>
        </MenuItem>
      </List>
    );
  }

  if (data?.type === 'user') {
    const exist = user.includes(data.regex);
    return (
      <List>
        <MenuItem onClick={handleUser}>
          <ListItemIcon>{exist ? <RedoIcon /> : <BlockIcon />}</ListItemIcon>
          <Typography>{exist ? '사용자 뮤트 해제' : '사용자 뮤트'}</Typography>
        </MenuItem>
      </List>
    );
  }

  if (data?.type === 'category') {
    const config = filter.category?.[data.id];

    return (
      <List>
        <MenuItem sx={{ opacity: '1 !important' }} dense disabled>
          [{data.label}]
        </MenuItem>
        <MenuItem onClick={handleCategory('mutePreview')}>
          <ListItemIcon>
            {config?.mutePreview ? <RedoIcon /> : <BlockIcon />}
          </ListItemIcon>
          <Typography>
            {config?.mutePreview ? '미리보기 뮤트 해제' : '미리보기 뮤트'}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleCategory('muteArticle')}>
          <ListItemIcon>
            {config?.muteArticle ? <RedoIcon /> : <BlockIcon />}
          </ListItemIcon>
          <Typography>
            {config?.muteArticle ? '게시물 뮤트 해제' : '게시물 뮤트'}
          </Typography>
        </MenuItem>
      </List>
    );
  }

  return null;
}

Mute.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default Mute;
