import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { PhotoLibrary } from '@mui/icons-material';

import { ARTICLE_GIFS, ARTICLE_IMAGES } from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';

import { useSelector } from 'react-redux';
import Info from '../FeatureInfo';
import FolderCheckList from './FolderCheckList';

function ContextMenu({ target, closeMenu }) {
  const { enabled } = useSelector((state) => state[Info.id].storage);

  const data = useContextMenu(
    {
      key: Info.id,
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
              <PhotoLibrary />
            </ListItemIcon>
            <ListItemText
              primary="자짤 관리"
              secondary="이미지의 오른쪽 클릭 메뉴가 활성화됩니다."
            />
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
