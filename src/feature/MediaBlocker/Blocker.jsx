import React, { useCallback, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { IconButton, Popper, Portal } from '@material-ui/core';
import { ImageSearch } from '@material-ui/icons';

const Styles = {
  '@global': {
    '.article-content': {
      '&:not(.media-blocker-unhide)': {
        '& .media-blocker': {
          display: 'none',
        },
        '& .media-blocker-btns.removed': {
          display: 'none',
        },
      },
      '&.media-blocker-unhide .media-blocker-btns': {
        display: 'none',
      },
    },
  },
};

function Blocker({ classes, referenceElement, container }) {
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    container.classList.add('media-blocker-btns');
    referenceElement.classList.add('media-blocker');
  }, [classes, container, referenceElement]);

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
    thumb = `${referenceElement.src}?type=list`;
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
        >
          <ImageSearch />
        </IconButton>
      </Portal>
      <Popper open={!!anchor} anchorEl={anchor} placement="right">
        <img width={100} height={100} src={thumb} alt="" />
      </Popper>
    </>
  );
}

export default withStyles(Styles)(Blocker);
