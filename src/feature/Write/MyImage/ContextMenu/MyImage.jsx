import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenuTrigger } from 'feature/Menu/ContextMenu/hooks';

import info from '../info';
import FolderCheckList from './FolderCheckList';

function MyImage({ target, closeMenu }) {
  const { enabled } = useSelector((state) => state[info.id].storage);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  // 트리거 등록
  useContextMenuTrigger(
    {
      key: info.id,
      selector: enabled ? `${ARTICLE_IMAGES}, ${ARTICLE_GIFS}` : 'NULL',
    },
    [target],
  );

  const data = useMemo(() => {
    if (!target) return null;

    const url = target.src.split('?')[0];
    return { url };
  }, [target]);

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

MyImage.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default MyImage;
