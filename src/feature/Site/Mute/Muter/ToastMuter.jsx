import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { TOASTBOX } from 'core/selector';
import { useArcaSocket } from 'hooks/WebSocket';
import { useLoadChecker } from 'hooks/LoadChecker';

import Info from '../FeatureInfo';
import { trimEmotURL } from '../func';
import { filterSelector } from '../selector';

const style = {
  '@global': {
    '#toastbox': {
      '& .filtered-emoticon': {
        width: 'auto !important',
        height: 'auto !important',
        textDecoration: 'none !important',
        '&::after': {
          content: '"[아카콘 뮤트됨]"',
        },
        '& > img, & > video': {
          display: 'none !important',
        },
      },
    },
  },
};

function ToastMuter() {
  const [subscribeSocket, unsubscribeSocket] = useArcaSocket();
  const toastboxLoaded = useLoadChecker(TOASTBOX);

  const { userList, emotList } = useSelector(filterSelector);
  const { mk2, hideMutedMark, muteAllEmot } = useSelector(
    (state) => state[Info.ID].storage,
  );

  useEffect(() => {
    if (!mk2) return undefined;

    const listener = (e) => {
      const data = e.data.split('|');
      if (data[0] !== 'n') return true;

      const noti = JSON.parse(data[1]);

      // 이모티콘 뮤트 처리
      if (noti.mediaUrl) {
        const url = trimEmotURL(noti.mediaUrl);
        if (muteAllEmot || emotList.url[url]) {
          if (hideMutedMark) return false;

          delete noti.mediaUrl;
          noti.title = 'Arca Refresher';
          noti.message = '[뮤트된 아카콘]';
        }
      }

      // 사용자 뮤트
      const regex =
        userList.length > 0 ? new RegExp(userList.join('|')) : undefined;
      if (regex?.test(noti.username)) {
        if (hideMutedMark) return false;

        if (noti.mediaUrl) delete noti.mediaUrl;
        noti.title = 'Arca Refresher';
        noti.message = '[뮤트된 이용자의 알림]';
      }

      const injectedData = `${data[0]}|${JSON.stringify(noti)}`;
      Object.defineProperty(e, 'data', { value: injectedData });
      return true;
    };
    subscribeSocket(listener);

    return () => unsubscribeSocket(listener);
  }, [
    emotList,
    userList,
    mk2,
    hideMutedMark,
    muteAllEmot,
    subscribeSocket,
    unsubscribeSocket,
  ]);

  useEffect(() => {
    if (mk2) return undefined;
    if (!toastboxLoaded) return undefined;

    const toastbox = document.querySelector(TOASTBOX);
    const observer = new MutationObserver(() => {
      // 이모티콘 뮤트 처리
      toastbox.querySelectorAll('img').forEach((img) => {
        const url = trimEmotURL(img.src);
        if (emotList.url[url] > -1) {
          img.parentNode.classList.add('filtered-emoticon');
        }
      });

      // 사용자 뮤트
      if (!userList.length) return;
      toastbox.querySelectorAll('.toast').forEach((toast) => {
        const header = toast
          .querySelector('.toast-header > strong')
          .textContent.split('님의')[0];
        const body = toast.querySelector('.toast-body');
        const content = body.textContent.split('님의')[0];

        const regex = new RegExp(userList.join('|'));
        if (regex.test(header) || regex.test(content)) {
          if (hideMutedMark) {
            toast.remove();
            return;
          }

          body.textContent = '[뮤트된 이용자의 알림]';
        }
      });

      if (toastbox.childElementCount === 0) {
        toastbox.style.dispaly = 'none';
      }
    });
    observer.observe(toastbox, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [mk2, hideMutedMark, toastboxLoaded, userList, emotList]);

  return null;
}

export default withStyles(style)(ToastMuter);
