import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

import {
  BOARD_ITEMS_WITH_NOTICE,
  USER_INFO,
  USER_MENTION,
} from 'core/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu';
import { useSnackbarAlert } from 'feature/Menu/SnackbarAlert';
import { useContent } from 'hooks/Content';
import { ArcaUser } from 'func/user';

import { open } from 'func/window';
import { getDocument } from 'func/http';
import info from '../info';

const profileUrl = 'https://arca.live/u/@';

function UserProfile({ target, closeMenu }) {
  const setSnack = useSnackbarAlert();

  const { channel } = useContent();
  const { contextRange, openType, checkSpamAccount } = useSelector(
    (store) => store[info.id].storage,
  );

  const [profileData, setProfileData] = useState(null);

  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}, ${USER_MENTION}`;
      break;
    case 'nickname':
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
    default:
      console.warn('[UserProfile] contextRange 값이 올바르지 않음');
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
  }

  // 트리거 등록
  useContextMenuTrigger({
    key: info.id,
    selector: contextSelector,
  });

  const data = useMemo(() => {
    if (!target) return null;

    let userElement = target;
    if (target.matches('.vrow')) {
      userElement = target.querySelector('span.user-info');
    }
    if (!userElement) return null;

    const user = new ArcaUser(userElement);
    // 유동 제외
    if (user.type === ArcaUser.TYPE_IP) return null;

    return user;
  }, [target]);

  useEffect(() => {
    if (!checkSpamAccount) return;
    if (!data) return;

    (async () => {
      const userPath = data.toString().replace('#', '/');

      try {
        const profileDocument = await fetch(`${profileUrl}${userPath}`)
          .then((response) => {
            if (!response.ok && response.status === 404) {
              throw new Error('없는 이용자');
            }

            return response.text();
          })
          .then((text) => getDocument(text));

        const list = [
          ...profileDocument.querySelectorAll(
            '.card-block .user-recent, .card-block .clearfix',
          ),
        ];
        const article = list.findIndex((l) => l.matches('.clearfix'));

        setProfileData({ article, comment: list.length - article - 1 });
      } catch (_) {
        setProfileData({ error: true });
      }
    })();
  }, [data, checkSpamAccount]);

  const handleProfile = useCallback(() => {
    open(`${profileUrl}${data.toString().replace('#', '/')}`, openType);
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleCopyId = useCallback(async () => {
    try {
      closeMenu();
      await navigator.clipboard.writeText(`@${data.toString()}`);
    } catch (error) {
      setSnack({ msg: '클립보드 액세스 권한이 없습니다.', time: 3000 });
      console.error(error);
    }
  }, [closeMenu, data, setSnack]);

  const handleSearchAll = useCallback(async () => {
    open(
      `https://arca.live/b/breaking?target=nickname&keyword=${
        data.toString().split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [closeMenu, data, openType]);

  const handleSearchChannel = useCallback(async () => {
    open(
      `https://arca.live/b/${channel.id}?target=nickname&keyword=${
        data.toString().split('#')[0]
      }`,
      openType,
    );
    closeMenu();
  }, [channel, closeMenu, data, openType]);

  const profileArticleCount =
    profileData?.article === 15 ? '15 ↑' : profileData?.article;
  const profileCommentCount =
    profileData?.comment === 15 ? '15 ↑' : profileData?.comment;

  if (!data) return null;
  return (
    <List>
      {checkSpamAccount && (
        <MenuItem disabled>
          {!profileData && <Typography>글, 댓글 수 조회 중...</Typography>}
          {profileData && profileData.error && (
            <Typography>조회 실패</Typography>
          )}
          {profileData && !profileData.error && (
            <Typography>{`글: ${profileArticleCount} / 댓글: ${profileCommentCount}`}</Typography>
          )}
        </MenuItem>
      )}
      <MenuItem onClick={handleProfile}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <Typography>사용자 정보</Typography>
      </MenuItem>
      <MenuItem onClick={handleCopyId}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <Typography>멘션 아이디 복사</Typography>
      </MenuItem>
      <MenuItem onClick={handleSearchChannel}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <Typography>채널 내 검색</Typography>
      </MenuItem>
      <MenuItem onClick={handleSearchAll}>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <Typography>종합속보 검색</Typography>
      </MenuItem>
    </List>
  );
}

UserProfile.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default UserProfile;
