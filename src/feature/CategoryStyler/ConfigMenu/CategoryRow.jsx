import React, { useCallback } from 'react';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@material-ui/core';
import {
  FormatBold,
  FormatStrikethrough,
  MeetingRoom,
  NoMeetingRoom,
  Replay,
} from '@material-ui/icons';
import { ColorPicker } from 'material-ui-color';
import { useDispatch, useSelector } from 'react-redux';

import { useParser } from 'util/Parser';
import getContrastYIQ from 'util/color';
import { MODULE_ID } from '../ModuleInfo';
import { setStyle } from '../slice';

function CategoryRow({ divider, category, nameMap }) {
  const dispatch = useDispatch();
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { channelID } = useParser();
  const { color } = useSelector((state) => state[MODULE_ID]);
  const channelColor = { ...color?.[channelID] };
  const { badge, bgcolor, bold, through, disableVisited } = {
    ...channelColor?.[category],
  };

  const handleColor = useCallback(
    (id, type) => (colorData) => {
      const updatedData = {
        ...channelColor,
        [id]: {
          ...channelColor[id],
          [type]: colorData.error ? '' : colorData.css.backgroundColor,
        },
      };
      dispatch(setStyle({ channel: channelID, color: updatedData }));
    },
    [channelColor, channelID, dispatch],
  );

  const handleStyle = useCallback(
    (id, type) => () => {
      const updatedData = {
        ...channelColor,
        [id]: {
          ...channelColor[id],
          [type]: !(channelColor[id] || {})[type],
        },
      };
      dispatch(setStyle({ channel: channelID, color: updatedData }));
    },
    [channelColor, channelID, dispatch],
  );

  const handleResetStyle = useCallback(
    (id) => () => {
      const updatedData = {
        ...channelColor,
        [id]: {},
      };
      dispatch(setStyle({ channel: channelID, color: updatedData }));
    },
    [channelColor, channelID, dispatch],
  );

  const badgeStyle = {
    margin: '0.25rem',
    ...(badge ? { backgroundColor: badge, color: getContrastYIQ(badge) } : {}),
  };
  const backgroundStyle = {
    ...(bgcolor
      ? {
          background: `linear-gradient(90deg, ${bgcolor}, rgba(0, 0, 0, 0))`,
          color: getContrastYIQ(bgcolor),
        }
      : {}),
    ...(bold ? { fontWeight: 'bold' } : {}),
    ...(through ? { textDecoration: 'line-through' } : {}),
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
          display="flex"
          height="100%"
          minHeight="48px"
          width="100%"
          alignItems="center"
          style={backgroundStyle}
        >
          <span className="badge badge-success" style={badgeStyle}>
            {nameMap[category]}
          </span>
          <span className="title">게시물 제목</span>
        </Box>
      </Grid>
      <Grid item sm={6} xs={12}>
        <Box
          display="flex"
          justifyContent={mobile ? null : 'flex-end'}
          alignItems="center"
        >
          <Tooltip title="카테고리 색">
            <span>
              <ColorPicker
                hideTextfield
                deferred
                disableAlpha
                value={badge || null}
                onChange={handleColor(category, 'badge')}
              />
            </span>
          </Tooltip>
          <Tooltip title="배경색">
            <span>
              <ColorPicker
                hideTextfield
                deferred
                disableAlpha
                value={bgcolor || null}
                onChange={handleColor(category, 'bgcolor')}
              />
            </span>
          </Tooltip>
          <Tooltip title="굵게">
            <IconButton onClick={handleStyle(category, 'bold')}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="취소선">
            <IconButton onClick={handleStyle(category, 'through')}>
              <FormatStrikethrough />
            </IconButton>
          </Tooltip>
          <Tooltip title={disableVisited ? '방문 표시 안함' : '방문 표시'}>
            <IconButton onClick={handleStyle(category, 'disableVisited')}>
              {disableVisited ? <NoMeetingRoom /> : <MeetingRoom />}
            </IconButton>
          </Tooltip>
          <Tooltip title="리셋">
            <IconButton onClick={handleResetStyle(category)}>
              <Replay />
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
