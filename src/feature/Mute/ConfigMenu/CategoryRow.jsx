import React, { useCallback } from 'react';
import { Box, Divider, Grid, IconButton, Tooltip } from '@material-ui/core';
import { BrokenImage, Image, VolumeOff, VolumeUp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import { useParser } from 'util/Parser';
import { MODULE_ID } from '../ModuleInfo';
import { setCategoryConfig } from '../slice';

function CategoryRow({ divider, category, nameMap }) {
  const dispatch = useDispatch();
  const { channelID } = useParser();
  const { category: categoryConfig } = useSelector((state) => state[MODULE_ID]);
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
      <Grid item xs={6}>
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
      <Grid item xs={6}>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
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
