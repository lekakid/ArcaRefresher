import React, { Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { List, Paper, Typography } from '@mui/material';

import { TextFieldRow } from 'component/ConfigMenu';

import Info from '../FeatureInfo';
import { $setExtraPrefix, $setPrefixList, $setSuffixList } from '../slice';

const View = React.forwardRef((_props, ref) => {
  const { prefixList, suffixList, extraPrefix } = useSelector(
    (state) => state[Info.id].storage,
  );

  const handleSaveFormat = useCallback(
    (value) => value.split('\n').filter((v) => v),
    [],
  );

  return (
    <Fragment ref={ref}>
      <Typography variant="subtitle1">{Info.name}</Typography>
      <Paper>
        <List disablePadding>
          <TextFieldRow
            divider
            primary="익명화 앞단어"
            multiline
            manualSave
            value={prefixList.join('\n')}
            action={$setPrefixList}
            saveFormat={handleSaveFormat}
          />
          <TextFieldRow
            divider
            primary="익명화 뒷단어"
            multiline
            manualSave
            value={suffixList.join('\n')}
            action={$setSuffixList}
            saveFormat={handleSaveFormat}
          />
          <TextFieldRow
            primary="익명화 보조단어"
            secondary="단어 조합보다 댓글이 더 많을 경우 사용됩니다."
            value={extraPrefix}
            action={$setExtraPrefix}
          />
        </List>
      </Paper>
    </Fragment>
  );
});

View.displayName = `ConfigMenuView(${Info.id})`;
export default View;
