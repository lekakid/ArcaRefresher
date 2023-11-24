import React, { useCallback, useState } from 'react';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

import Info from '../FeatureInfo';
import FolderCheckList from './FolderCheckList';

function ContextMenu({ target }) {
  const [data, closeMenu] = useContextMenu(
    {
      key: Info.ID,
      selector: `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}`,
      dataExtractor: () => {
        if (!target) return undefined;

        const url = target.src.split('?')[0];
        return { url };
      },
    },
    [target],
  );

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
