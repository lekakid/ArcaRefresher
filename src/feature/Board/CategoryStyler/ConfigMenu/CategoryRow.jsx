import React, { useCallback, useState } from 'react';
import { Box, Divider, Grid, IconButton, Stack, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatStrikethrough,
  MeetingRoom,
  NoMeetingRoom,
  Replay,
} from '@mui/icons-material';

import ColorPicker from 'component/ColorPicker';
import { getContrastYIQ } from 'func/color';

const DEFAULT_CATEGORY_CONFIG = {
  badge: '',
  bgcolor: '',
  bold: false,
  through: false,
  disableVisited: false,
};

function CategoryRow({ divider, id, label, initValue, onChange }) {
  const [value, setValue] = useState({
    ...DEFAULT_CATEGORY_CONFIG,
    ...initValue,
  });

  const handleColor = useCallback(
    (type) => (color) => {
      const updateValue = {
        ...value,
        [type]: color,
      };
      setValue(updateValue);
      onChange(id, updateValue);
    },
    [id, onChange, value],
  );

  const handleBool = useCallback(
    (type) => () => {
      const updateValue = {
        ...value,
        [type]: !value[type],
      };
      setValue(updateValue);
      onChange(id, updateValue);
    },
    [id, onChange, value],
  );

  const handleResetStyle = useCallback(() => {
    const updateValue = { ...DEFAULT_CATEGORY_CONFIG };
    setValue(updateValue);
    onChange(id, updateValue);
  }, [id, onChange]);

  const { badge = null, bgcolor = null, bold, through, disableVisited } = value;

  const badgeStyle = {
    margin: '0.25rem',
    ...(badge
      ? { backgroundColor: badge, color: getContrastYIQ(badge) }
      : { backgroundColor: 'var(--color-board-category)' }),
  };
  const backgroundStyle = {
    ...(bgcolor && {
      background: `linear-gradient(90deg, ${bgcolor}, rgba(0, 0, 0, 0))`,
      color: getContrastYIQ(bgcolor),
    }),
    ...(bold && { fontWeight: 'bold' }),
    ...(through && { textDecoration: 'line-through' }),
  };

  return (
    <>
      {divider && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}
      <Grid item sm={6} xs={12}>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            minHeight: '48px',
            width: '100%',
            alignItems: 'center',
            ...backgroundStyle,
          }}
        >
          <span className="badge badge-success" style={badgeStyle}>
            {label}
          </span>
          <span className="title">게시물 제목</span>
        </Box>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Tooltip title="카테고리 색">
            <span>
              <ColorPicker color={badge} onChange={handleColor('badge')} />
            </span>
          </Tooltip>
          <Tooltip title="배경색">
            <span>
              <ColorPicker color={bgcolor} onChange={handleColor('bgcolor')} />
            </span>
          </Tooltip>
          <Tooltip title="굵게">
            <IconButton onClick={handleBool('bold')} size="large">
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="취소선">
            <IconButton onClick={handleBool('through')} size="large">
              <FormatStrikethrough />
            </IconButton>
          </Tooltip>
          <Tooltip title={disableVisited ? '방문 표시 안함' : '방문 표시'}>
            <IconButton onClick={handleBool('disableVisited')} size="large">
              {disableVisited ? <NoMeetingRoom /> : <MeetingRoom />}
            </IconButton>
          </Tooltip>
          <Tooltip title="리셋">
            <IconButton onClick={handleResetStyle} size="large">
              <Replay />
            </IconButton>
          </Tooltip>
        </Stack>
      </Grid>
    </>
  );
}

function compare(prev, next) {
  return (
    prev.badge === next.badge &&
    prev.bgcolor === next.bgcolor &&
    prev.bold === next.bold &&
    prev.through === next.through &&
    prev.disableVisited === next.disableVisited
  );
}
export default React.memo(CategoryRow, compare);
