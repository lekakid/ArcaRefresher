import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  FormatBold,
  FormatStrikethrough,
  MeetingRoom,
  NoMeetingRoom,
} from '@material-ui/icons';
import { ColorPicker } from 'material-ui-color';

import useElementQuery from '../$Common/useElementQuery';
import { BOARD_LOADED } from '../$Common/Selector';
import { getCategory } from '../$Common/Parser';

import { MODULE_ID, MODULE_NAME } from './ModuleInfo';
import { setStyle } from './slice';

import getContrastYIQ from './getContrastYIQ';

export default function ConfigView() {
  const { channelID, color } = useSelector((state) => state[MODULE_ID]);
  const dispatch = useDispatch();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const boardLoaded = useElementQuery(BOARD_LOADED);
  const [categoryMap, setCategoryMap] = useState({});

  useLayoutEffect(() => {
    if (!boardLoaded) return;
    setCategoryMap(getCategory());
  }, [boardLoaded]);

  const channelColor = color[channelID] || {};

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

  return (
    <>
      <Typography variant="subtitle1">{MODULE_NAME}</Typography>
      <Paper>
        <List>
          <ListItem>
            <ListItemText>색상 설정</ListItemText>
          </ListItem>
          <ListItem>
            <Paper variant="outlined">
              <Grid container>
                {Object.keys(categoryMap).map((id, index) => {
                  const { badge, bgcolor, bold, through, disableVisited } =
                    channelColor[id] || {};
                  const badgeStyle = {
                    margin: '0.25rem',
                    ...(badge
                      ? { backgroundColor: badge, color: getContrastYIQ(badge) }
                      : {}),
                  };
                  const containerStyle = {
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
                      {index !== 0 && (
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
                          style={containerStyle}
                        >
                          <span
                            className="badge badge-success"
                            style={badgeStyle}
                          >
                            {categoryMap[id]}
                          </span>
                          <span className="title">게시물 제목</span>
                        </Box>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Box
                          display="flex"
                          justifyContent={mobile ? null : 'flex-end'}
                        >
                          <Tooltip title="카테고리 색">
                            <IconButton
                              disableRipple
                              disableFocusRipple
                              size="small"
                            >
                              <ColorPicker
                                hideTextfield
                                deferred
                                disableAlpha
                                value={badge || null}
                                onChange={handleColor(id, 'badge')}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="배경색">
                            <IconButton
                              disableRipple
                              disableFocusRipple
                              size="small"
                            >
                              <ColorPicker
                                hideTextfield
                                deferred
                                disableAlpha
                                value={bgcolor || null}
                                onChange={handleColor(id, 'bgcolor')}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="굵게">
                            <IconButton onClick={handleStyle(id, 'bold')}>
                              <FormatBold />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="취소선">
                            <IconButton onClick={handleStyle(id, 'through')}>
                              <FormatStrikethrough />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              disableVisited ? '방문 표시 안함' : '방문 표시'
                            }
                          >
                            <IconButton
                              onClick={handleStyle(id, 'disableVisited')}
                            >
                              {disableVisited && <NoMeetingRoom />}
                              {!disableVisited && <MeetingRoom />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            </Paper>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
