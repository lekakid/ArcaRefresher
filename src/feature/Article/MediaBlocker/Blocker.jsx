import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popper, Portal } from '@mui/material';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

function Blocker({ referenceElement, container }) {
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    container.classList.add('media-blocker-btns');
    referenceElement.classList.add('media-blocker');
  }, [container, referenceElement]);

  const handleEnter = useCallback((e) => {
    setAnchor(e.currentTarget);
  }, []);

  const handleLeave = useCallback(() => {
    setAnchor(null);
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      container.classList.add('removed');
      referenceElement.classList.remove('media-blocker');
    },
    [container, referenceElement],
  );

  let thumb = '';
  if (referenceElement.nodeName === 'IMG') {
    thumb = `${referenceElement.src}&type=list`;
  } else if (
    referenceElement.nodeName === 'VIDEO' &&
    referenceElement.dataset.version === 'v1'
  ) {
    thumb = `${referenceElement.src}.gif`;
  } else if (
    referenceElement.nodeName === 'VIDEO' &&
    referenceElement.dataset.version === 'v2'
  ) {
    thumb = referenceElement.poster;
  }

  return (
    <>
      <Portal container={container}>
        <IconButton
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={handleClick}
          size="large"
        >
          <ImageSearchIcon />
        </IconButton>
      </Portal>
      <Popper open={!!anchor} anchorEl={anchor} placement="right">
        <img width={100} height={100} src={thumb} alt="" />
      </Popper>
    </>
  );
}

Blocker.propTypes = {
  referenceElement: PropTypes.object,
  container: PropTypes.object,
};

export default Blocker;
