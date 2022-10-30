import React, { useCallback } from 'react';
import { Box, Divider, Grid, IconButton, Tooltip } from '@material-ui/core';
import { BrokenImage, Image, VolumeOff, VolumeUp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';

import { useContent } from 'util/ContentInfo';
import Info from '../FeatureInfo';
import { $setCategoryConfig } from '../slice';

const DEFAULT_CHANNEL_CONFIG = {};
const DEFAULT_CATEGORY_CONFIG = { mutePreview: false, muteArticle: false };

function CategoryRow({ divider, category, nameMap }) {
  const dispatch = useDispatch();
  const { channel } = useContent();
  const {
    storage: { category: categoryConfig },
  } = useSelector((state) => state[Info.ID]);
  const channelConfig = categoryConfig?.[channel.ID] || DEFAULT_CHANNEL_CONFIG;
  const { mutePreview, muteArticle } =
    channelConfig?.[category] || DEFAULT_CATEGORY_CONFIG;

  const handleCategory = useCallback(
    (categoryID, type) => () => {
      const newConfig = {
        ...channelConfig,
        [categoryID]: {
          ...channelConfig?.[categoryID],
          [type]: !channelConfig?.[categoryID]?.[type],
        },
      };
      dispatch(
        $setCategoryConfig({
          channel: channel.ID,
          config: newConfig,
        }),
      );
    },
    [channelConfig, channel, dispatch],
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
