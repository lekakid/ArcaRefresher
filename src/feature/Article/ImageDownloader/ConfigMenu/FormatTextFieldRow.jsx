import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const FormatTextFieldRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function FormatTextFieldRow(
    { divider, nested, primary, secondary, value, action, children },
    ref,
  ) {
    const dispatch = useDispatch();

    const inputRef = useRef(undefined);
    const cursorRef = useRef({
      start: 0,
      end: 0,
    });
    const [anchorEl, setAnchorEl] = useState(null);

    const handleEdit = useCallback(
      (e) => {
        dispatch(action(e.target.value));
      },
      [action, dispatch],
    );

    const handleInputSelect = useCallback((e) => {
      cursorRef.current = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd,
      };
    }, []);

    const handleOpen = useCallback((e) => {
      setAnchorEl(e.target);
    }, []);

    const handleClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    const handleItemSelect = useCallback(
      (e) => {
        const text = e.target.getAttribute('value');
        const orig = inputRef.current.value;
        const { start, end } = cursorRef.current;
        const result = orig.substr(0, start) + text + orig.substr(end);
        inputRef.current.value = result;
        dispatch(action(inputRef.current.value));
        setAnchorEl(null);
      },
      [action, dispatch],
    );

    return (
      <>
        <ListItem
          ref={ref}
          sx={
            nested && {
              paddingLeft: 4,
            }
          }
        >
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
        <ListItem
          ref={ref}
          divider={divider}
          sx={
            nested && {
              paddingLeft: 4,
            }
          }
        >
          <TextField
            inputRef={inputRef}
            fullWidth
            value={value}
            onSelect={handleInputSelect}
            onChange={handleEdit}
          />
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={handleOpen}>
              <Add />
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
              {React.Children.map(children, (child) =>
                React.cloneElement(child, { onClick: handleItemSelect }),
              )}
            </Menu>
          </ListItemSecondaryAction>
        </ListItem>
      </>
    );
  },
);

export default FormatTextFieldRow;
