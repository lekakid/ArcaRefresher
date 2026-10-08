import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Comment } from '@mui/icons-material';

import {
  BOARD_ITEMS_WITH_NOTICE,
  USER_INFO,
  USER_MENTION,
} from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { ArcaUser } from 'func/user';

import { setInputUser } from '../slice';
import Info from '../FeatureInfo';

function ContextMenu({ target, closeMenu }) {
  const dispatch = useDispatch();
  const { memo, contextRange } = useSelector((state) => state[Info.id].storage);

  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}, ${USER_MENTION}`;
      break;
    case 'nickname':
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
    default:
      console.warn('[Memo] contextRange 값이 올바르지 않음');
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
  }

  const data = useContextMenu(
    {
      key: Info.id,
      selector: contextSelector,
      dataExtractor: () => {
        if (!target) return undefined;

        let userElement = target;
        if (target.matches('.vrow')) {
          userElement = target.querySelector('span.user-info');
        }
        if (!userElement) return undefined;

        return new ArcaUser(userElement);
      },
    },
    [target],
  );

  if (!data) return null;

  const uid = data.toUID();
  const label = `메모 ${memo[uid]?.msg ? `(${memo[uid].msg})` : ''}`;
  return (
    <List>
      <MenuItem
        onClick={() => {
          dispatch(setInputUser(uid));
          closeMenu();
        }}
      >
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <Typography>{label}</Typography>
      </MenuItem>
    </List>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
  closeMenu: PropTypes.func,
};

export default ContextMenu;
