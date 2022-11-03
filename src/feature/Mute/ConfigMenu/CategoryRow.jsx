import React, { useCallback, useState } from 'react';
import { Box, Divider, Grid, IconButton, Tooltip } from '@material-ui/core';
import { BrokenImage, Image, VolumeOff, VolumeUp } from '@material-ui/icons';

const DEFAULT_CATEGORY_CONFIG = { mutePreview: false, muteArticle: false };

function CategoryRow({ divider, id, label, initValue, onChange }) {
  const [value, setValue] = useState({
    ...DEFAULT_CATEGORY_CONFIG,
    ...initValue,
  });

  const handleBool = useCallback(
    (type) => () => {
      const updateValue = {
        ...value,
        [type]: !value[type],
      };
      setValue(updateValue);
      onChange(id, updateValue);
    },
    [value, onChange, id],
  );

  const { mutePreview, muteArticle } = value;

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
            {label}
          </span>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Tooltip title="미리보기 뮤트">
            <IconButton onClick={handleBool('mutePreview')}>
              {mutePreview ? <BrokenImage /> : <Image />}
            </IconButton>
          </Tooltip>
          <Tooltip title="게시물 뮤트">
            <IconButton onClick={handleBool('muteArticle')}>
              {muteArticle ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </>
  );
}

export default CategoryRow;
