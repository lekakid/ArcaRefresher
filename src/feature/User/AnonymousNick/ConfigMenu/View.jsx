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

import { TextEditorRow } from 'component/config';

import Info from '../FeatureInfo';
import { $setExtraPrefix, $setPrefixList, $setSuffixList } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { prefixList, suffixList, extraPrefix } = useSelector(
    (state) => state[Info.ID].storage,
  );
  const dispatch = useDispatch();

  const onSavePrefixList = useCallback(
    (value) => {
      const updatedList = value.split('\n').filter((v) => v !== '');
      dispatch($setPrefixList(updatedList));
    },
    [dispatch],
  );

  const onSaveSuffixList = useCallback(
    (value) => {
      const updatedList = value.split('\n').filter((v) => v !== '');
      dispatch($setSuffixList(updatedList));
    },
    [dispatch],
  );

  const onChangeExtraPrefix = useCallback(
    (e) => {
      dispatch($setExtraPrefix(e.target.value));
    },
    [dispatch],
  );

  return (
    <Box ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <TextEditorRow
            divider
            primary="익명화 앞단어"
            initialValue={prefixList.join('\n')}
            onSave={onSavePrefixList}
          />
          <TextEditorRow
            divider
            primary="익명화 뒷단어"
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

View.displayName = `ConfigMenuView(${Info.ID})`;
export default View;
