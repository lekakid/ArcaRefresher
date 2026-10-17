import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

import info from '../info';
import FolderCheckList from './FolderCheckList';

function ContextMenu({ target, closeMenu }) {
  const { enabled } = useSelector((state) => state[info.id].storage);

  const data = useContextMenu(
    {
      key: info.id,
      selector: enabled ? `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}` : 'NULL',
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
              <PhotoLibraryIcon />
            </ListItemIcon>
            <ListItemText primary="자짤 관리" />
          </MenuItem>
        </List>
      )}
      <FolderCheckList open={open} url={url} onClose={() => setOpen(false)} />
    </>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
