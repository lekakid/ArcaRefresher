import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Box,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';

import { BaseRow } from 'component/ConfigMenu';

import { FORMAT } from '../func/format';

const FormatTextFieldRow = React.forwardRef(
  (
    { divider, nested, primary, secondary, selectableList, value, action },
    ref,
  ) => {
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
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        column="always"
        header={<ListItemText primary={primary} secondary={secondary} />}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            inputRef={inputRef}
            inputProps={{
              sx: {
                paddingRight: 4.5,
              },
            }}
            value={value}
            onSelect={handleInputSelect}
            onChange={handleEdit}
          />
          <IconButton
            sx={{ position: 'absolute', bottom: 11, right: 19 }}
            size="small"
            onClick={handleOpen}
          >
            <Add />
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
            {selectableList.map((s) => (
              <MenuItem
                key={s}
                value={FORMAT[s].STRING}
                onClick={handleItemSelect}
              >
                {FORMAT[s].LABEL}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </BaseRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  selectableList: PropTypes.array,
  value: PropTypes.string,
  action: PropTypes.func,
};

FormatTextFieldRow.propTypes = RowPropTypes;
export default FormatTextFieldRow;
