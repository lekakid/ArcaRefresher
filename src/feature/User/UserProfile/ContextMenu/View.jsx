import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Assignment, Person, Search } from '@material-ui/icons';

import { BOARD_ITEMS_WITH_NOTICE, USER_INFO } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { useSnackbarAlert } from 'menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { getUserNick } from 'func/user';

import { open } from 'func/window';
import toDocument from 'func/toDocument';
import Info from '../FeatureInfo';

const profileUrl = 'https://arca.live/u/@';

function ContextMenu({ targetRef }) {
  const setSnack = useSnackbarAlert();
  const { contextRange, openType, checkSpamAccount } = useSelector(
    (store) => store[Info.ID].storage,
  );
  const { channel } = useContent();
  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}`;
      break;
    case 'nickname':
      contextSelector = USER_INFO;
      break;
    default:
      console.warn('[UserProfile] contextRange 값이 올바르지 않음');
      contextSelector = USER_INFO;
  }

  const [profileData, setProfileData] = useState(undefined);

  const [data, closeMenu] = useContextMenu(
    {
      targetRef,
      selector: contextSelector,
      dataExtractor: (target) => {
        let userElement = target;
        if (target.matches('.vrow')) {
          userElement = target.querySelector('span.user-info');
        }
        if (!userElement) return undefined;

        const id = getUserNick(userElement);
        // 유동 제외
        if (id.includes('.')) return undefined;
        const url = id.replace('#', '/');

        if (checkSpamAccount) {
          setProfileData(undefined);
          fetch(`${profileUrl}${url}`)
            .then((response) => {
              if (!response.ok) setProfileData({ article: -1, comment: -1 });

              return response.text();
            })
            .then((text) => {
              const doc = toDocument(text);
              if (doc.querySelector('.error-page')) {
                setProfileData({ article: -1, comment: -1 });
                return;
              }

              const list = [
                ...doc.querySelectorAll(
                  '.card-block .user-recent, .card-block .clearfix',
                ),
              ];
              const article = list.findIndex((l) => l.matches('.clearfix'));

              setProfileData({ article, comment: list.length - article - 1 });
            });
        }

        return { id, url };
      },
    },
    [checkSpamAccount],
  );

  const handleProfile = useCallback(() => {
    open(`${profileUrl}${data.url}`, openType);
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleCopyId = useCallback(async () => {
    closeMenu();
    await navigator.clipboard.writeText(`@${data.id}`);
    setSnack({ msg: '아이디가 복사되었습니다.', time: 3000 });
  }, [closeMenu, data, setSnack]);

  const handleSearchAll = useCallback(async () => {
    open(
      `https://arca.live/b/breaking?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleSearchChannel = useCallback(async () => {
    open(
      `https://arca.live/b/${channel.ID}?target=nickname&keyword=${
        data.id.split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [channel, closeMenu, data, openType]);

  let spamAccountAlert = checkSpamAccount && (
    <MenuItem disabled>
      <Typography>글, 댓글 수 조회 중...</Typography>
    </MenuItem>
  );

  if (profileData) {
    if (profileData.article < 0 || profileData.comment < 0) {
      spamAccountAlert = (
        <MenuItem disabled>
          <Typography>조회 실패</Typography>
        </MenuItem>
      );
    } else {
      const articleText = `글: ${
        profileData.article === 15 ? '15 ↑' : profileData.article
      }`;
      const commentText = `댓글: ${
        profileData.comment === 15 ? '15 ↑' : profileData.comment
      }`;
      spamAccountAlert = (
        <MenuItem disabled>
          <Typography>{`${articleText} / ${commentText}`}</Typography>
        </MenuItem>
      );
    }
  }

  if (!data) return null;
  return (
    <List>
      {spamAccountAlert}
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <Typography>사용자 정보</Typography>
      </MenuItem>
      <MenuItem onClick={handleCopyId}>
        <ListItemIcon>
          <Assignment />
        </ListItemIcon>
        <Typography>멘션 아이디 복사</Typography>
      </MenuItem>
      <MenuItem onClick={handleSearchChannel}>
        <ListItemIcon>
          <Search />
        </ListItemIcon>
        <Typography>채널 내 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleSearchAll}>
        <ListItemIcon>
          <Search />
        </ListItemIcon>
        <Typography>종합속보 검색</Typography>
      </MenuItem>
    </List>
  );
}

export default ContextMenu;
