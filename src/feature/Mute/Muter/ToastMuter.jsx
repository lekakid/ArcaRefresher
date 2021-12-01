import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withStyles } from '@material-ui/styles';

import { TOASTBOX } from 'core/selector';
import { useElementQuery } from 'core/hooks';

import { MODULE_ID } from '../ModuleInfo';
import useEmoticon from './useEmoticon';

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
      '& .filtered-toast .toast-body': {
        '&::after': {
          content: '"[뮤트된 이용자의 알림]"',
        },
        '& > a': {
          display: 'none',
        },
      },
    },
  },
};

function ToastMuter() {
  const { user, emoticon } = useSelector((state) => state[MODULE_ID]);
  const toastboxLoaded = useElementQuery(TOASTBOX);
  const filter = useEmoticon(emoticon);

  useEffect(() => {
    if (!toastboxLoaded) return null;

    const toastbox = document.querySelector(TOASTBOX);
    const observer = new MutationObserver(() => {
      toastbox.querySelectorAll('img').forEach((img) => {
        const url = img.src.replace('https:', '');
        if (filter.url.indexOf(url) > -1) {
          img.parentNode.classList.add('filtered-emoticon');
        }
      });

      toastbox.querySelectorAll('.toast').forEach((toast) => {
        const header = toast
          .querySelector('.toast-header > strong')
          .textContent.split('님의')[0];
        const content = toast
          .querySelector('.toast-body')
          .textContent.split('님의')[0];

        const regex = new RegExp(user.join('|'));
        console.log(header, content);
        if (regex.test(header) || regex.test(content)) {
          toast.classList.add('filtered-toast');
        }
      });
    });
    observer.observe(toastbox, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [filter, toastboxLoaded, user]);

  return null;
}

export default withStyles(style)(ToastMuter);
