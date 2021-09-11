import React, { useCallback } from 'react';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@material-ui/core';
import { BrokenImage, Image, VolumeOff, VolumeUp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import { MODULE_ID } from '../ModuleInfo';
import { setCategoryConfig } from '../slice';

function CategoryRow({ divider, category, nameMap }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { channelID, category: categoryConfig } = useSelector(
    (state) => state[MODULE_ID],
  );
  const channelConfig = { ...categoryConfig?.[channelID] };
  const { mutePreview = false, muteArticle = false } = {
    ...channelConfig?.[category],
  };

  const handleCategory = useCallback(
    (categoryID, type) => () => {
      const newConfig = {
        ...channelConfig,
        [categoryID]: {
          ...channelConfig[categoryID],
          [type]: !channelConfig[categoryID]?.[type],
        },
      };
      dispatch(
        setCategoryConfig({
          channel: channelID,
          config: newConfig,
        }),
      );
    },
    [channelConfig, channelID, dispatch],
  );

  return (
    <>
      {divider && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}
      <Grid item sm={6} xs={12}>
        <Box
          display="flex"
          height="100%"
          minHeight="48px"
          width="100%"
          alignItems="center"
        >
          <span className="badge badge-success" style={{ margin: '0.25rem' }}>
            {nameMap[category]}
          </span>
        </Box>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Box
          display="flex"
          justifyContent={mobile ? null : 'flex-end'}
          alignItems="center"
        >
          <Tooltip title="미리보기 뮤트">
            <IconButton onClick={handleCategory(category, 'mutePreview')}>
              {mutePreview ? <BrokenImage /> : <Image />}
            </IconButton>
          </Tooltip>
          <Tooltip title="게시물 뮤트">
            <IconButton onClick={handleCategory(category, 'muteArticle')}>
              {muteArticle ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </>
  );
}

CategoryRow.defaultProps = {
  categoryConfig: {},
};

export default CategoryRow;