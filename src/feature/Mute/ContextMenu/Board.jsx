import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, MenuItem, Typography } from '@material-ui/core';
import { Block, Redo } from '@material-ui/icons';

import { USER_INFO } from 'core/selector';
import { ContextMenuList, useContextMenu } from 'menu/ContextMenu';
import { setClose } from 'menu/ContextMenu/slice';
import { getUserInfo } from 'util/parser';

import { MODULE_ID } from '../ModuleInfo';
import { addUser, removeUser } from '../slice';

function makeRegex(id = '') {
  return `${id.replace('.', '\\.')}$`;
}

const Board = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function Board(_props, ref) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state[MODULE_ID]);

    const trigger = useCallback(
      ({ target }) => !!target.closest(USER_INFO),
      [],
    );
    const dataGetter = useCallback(({ target }) => {
      const id = getUserInfo(target.closest(USER_INFO));

      return { id };
    }, []);
    const data = useContextMenu({ trigger, dataGetter });

    const regex = makeRegex(data?.id);
    const exist = user.indexOf(regex) > -1;

    const handleMute = useCallback(() => {
      dispatch(exist ? removeUser(regex) : addUser(regex));
      dispatch(setClose());
    }, [dispatch, exist, regex]);

    if (!data) return null;
    return (
      <ContextMenuList>
        <MenuItem ref={ref} onClick={handleMute}>
          <ListItemIcon>{exist ? <Redo /> : <Block />}</ListItemIcon>
          <Typography>{exist ? '사용자 뮤트 해제' : '사용자 뮤트'}</Typography>
        </MenuItem>
      </ContextMenuList>
    );
  },
);

export default Board;
