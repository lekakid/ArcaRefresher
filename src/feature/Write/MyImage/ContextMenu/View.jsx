import React, { useCallback, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { PhotoLibrary } from '@material-ui/icons';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

import FolderCheckList from './FolderCheckList';

function ContextMenu({ targetRef }) {
  const [data, closeMenu] = useContextMenu({
    targetRef,
    selector: `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`,
    dataExtractor: (target) => {
      const url = target.src.split('?')[0];
      return { url };
    },
  });

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const showDialog = useCallback(() => {
    setUrl(data.url);
    setOpen(true);
    closeMenu();
  }, [closeMenu, data]);

  return (
    <>
      {data && (
        <List>
          <MenuItem onClick={showDialog}>
            <ListItemIcon>
              <PhotoLibrary />
            </ListItemIcon>
            <Typography>자짤 관리</Typography>
          </MenuItem>
        </List>
      )}
      <FolderCheckList open={open} url={url} onClose={() => setOpen(false)} />
    </>
  );
}

export default ContextMenu;
