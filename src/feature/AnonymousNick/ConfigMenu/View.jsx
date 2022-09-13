import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';

import { TextEditor } from 'component/config';

import { MODULE_ID, MODULE_NAME } from '../ModuleInfo';
import { setExtraPrefix, setPrefixList, setSuffixList } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const {
    config: { prefixList, suffixList, extraPrefix },
  } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();

  const onSavePrefixList = useCallback(
    (value) => {
      const updatedList = value.split('\n').filter((v) => v !== '');
      dispatch(setPrefixList(updatedList));
    },
    [dispatch],
  );

  const onSaveSuffixList = useCallback(
    (value) => {
      const updatedList = value.split('\n').filter((v) => v !== '');
      dispatch(setSuffixList(updatedList));
    },
    [dispatch],
  );

  const onChangeExtraPrefix = useCallback(
    (e) => {
      dispatch(setExtraPrefix(e.target.value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <TextEditor
            divider
            headerText="익명화 앞단어"
            initialValue={prefixList.join('\n')}
            onSave={onSavePrefixList}
          />
          <TextEditor
            divider
            headerText="익명화 뒷단어"
            initialValue={suffixList.join('\n')}
            onSave={onSaveSuffixList}
          />
          <ListItem>
            <ListItemText
              primary="익명화 보조단어"
              secondary="단어 조합보다 댓글이 더 많을 경우 사용됩니다."
            />
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              value={extraPrefix}
              onChange={onChangeExtraPrefix}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
});

View.displayName = `ConfigMenuView(${MODULE_ID})`;
export default View;
