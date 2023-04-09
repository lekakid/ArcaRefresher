import React, { useCallback, useState } from 'react';
import {
  Collapse,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

import ColorPicker from 'component/ColorPicker';

const ThemeColorList = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function ThemeColorList(
    { groupData, presetData, disabled, onColorChange },
    ref,
  ) {
    const [openGroup, setOpenGroup] = useState(() => ({}));

    const handleOpen = useCallback(
      (key) => () => {
        setOpenGroup((prev) => ({ ...prev, [key]: !prev[key] }));
      },
      [],
    );

    return (
      <List ref={ref} disablePadding>
        {groupData.map(({ key: groupKey, text, rows }) => (
          <React.Fragment key={groupKey}>
            <ListItem button divider onClick={handleOpen(groupKey)}>
              <ListItemText>{text}</ListItemText>
              <ListItemSecondaryAction>
                {openGroup[groupKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={openGroup[groupKey]}>
              <List disablePadding>
                {rows.map(({ key, primary, secondary }) => (
                  <ListItem key={key} divider disabled={disabled}>
                    <ListItemText primary={primary} secondary={secondary} />
                    <ListItemSecondaryAction>
                      <ColorPicker
                        disabled={disabled}
                        color={presetData[key]}
                        onChange={onColorChange(key)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    );
  },
);

export default ThemeColorList;
