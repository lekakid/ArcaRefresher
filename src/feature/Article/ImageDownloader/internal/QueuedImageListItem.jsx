import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, ImageListItem, ImageListItemBar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const CONCURRENCY = 5;
const DELAY_MS = 200;

let active = 0;
const queue = [];

function next() {
  if (active >= CONCURRENCY || queue.length === 0) return;
  active++;
  const { src, resolve, reject } = queue.shift();

  const img = new Image();
  const done = (fn) => () => {
    active--;
    setTimeout(next, DELAY_MS);
    fn(src);
  };
  img.onload = done(resolve);
  img.onerror = done(reject);
  img.src = src; // 여기서 실제 요청 발생 → 브라우저 캐시에 저장됨
}

function enqueue(src) {
  return new Promise((resolve, reject) => {
    queue.push({ src, resolve, reject });
    next();
  });
}

function QueuedImageListItem({ src, alt, checked, onClick }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        enqueue(src)
          .then(() => !cancelled && setReady(true))
          .catch(() => {});
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [src]);

  return (
    <ImageListItem onClick={onClick}>
      <img
        ref={ref}
        style={{
          overflow: 'hidden',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        src={ready ? src : undefined}
        alt={alt}
      />
      <ImageListItemBar
        sx={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }}
        position="top"
        actionPosition="left"
        actionIcon={
          <Checkbox
            size="small"
            sx={{
              color: 'white',
              '&.Mui-checked': {
                color: 'white',
              },
            }}
            icon={<CheckCircleOutlinedIcon />}
            checkedIcon={<CheckCircleIcon />}
            checked={checked}
            onClick={onClick}
          />
        }
      />
    </ImageListItem>
  );
}

QueuedImageListItem.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  alt: PropTypes.string,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};

export default QueuedImageListItem;
