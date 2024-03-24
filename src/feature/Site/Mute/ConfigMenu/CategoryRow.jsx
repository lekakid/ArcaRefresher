import { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, IconButton, Tooltip } from '@mui/material';
import { BrokenImage, Image, VolumeOff, VolumeUp } from '@mui/icons-material';

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
          sx={{
            display: 'flex',
            height: '100%',
            minHeight: '48px',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <span className="badge badge-success" style={{ margin: '0.25rem' }}>
            {label}
          </span>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Tooltip title="미리보기 뮤트">
            <IconButton onClick={handleBool('mutePreview')} size="large">
              {mutePreview ? <BrokenImage /> : <Image />}
            </IconButton>
          </Tooltip>
          <Tooltip title="게시물 뮤트">
            <IconButton onClick={handleBool('muteArticle')} size="large">
              {muteArticle ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </>
  );
}

CategoryRow.propTypes = {
  divider: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  initValue: PropTypes.object,
  onChange: PropTypes.func,
};

export default memo(CategoryRow);
