import { useState } from 'react';
import { Swatch, EditableInput } from '@uiw/react-color';
import PropTypes from 'prop-types';
import { Box, Paper, Stack } from '@mui/material';

const HEX = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

function TwitterPicker({ color, colors, onChange }) {
  const [value, setValue] = useState(null);

  return (
    <Paper>
      <Swatch
        colors={colors}
        color={color}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          width: 274,
          padding: 8,
        }}
        rectProps={{
          style: {
            width: 30,
            height: 30,
            borderRadius: 4,
            margin: 0,
            marginRight: 6,
          },
        }}
        onChange={(_, result) => {
          setValue(result.hex);
          onChange(result.hex);
        }}
        addonAfter={
          <Paper
            variant="outlined"
            sx={{
              height: 30,
              borderRadius: 1,
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <Stack direction="row" height="100%" alignItems="center">
              <Box
                sx={{
                  minWidth: 30,
                  height: '100%',
                  bgcolor: 'divider',
                  color: 'action.active',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                #
              </Box>
              <Box>
                <EditableInput
                  inputStyle={{
                    border: 0,
                    boxShadow: 0,
                    outline: 0,
                    fontSize: 14,
                  }}
                  value={value?.replace('#', '') ?? color?.replace('#', '')}
                  onChange={(_, v) => {
                    setValue(v.hex);
                    if (HEX.test(v)) {
                      onChange(v.replace('#', ''));
                    }
                    if (v === 0) {
                      onChange('');
                    }
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        }
      />
    </Paper>
  );
}

TwitterPicker.defaultProps = {
  colors: [
    '#FF6900',
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
  ],
};

TwitterPicker.propTypes = {
  color: PropTypes.string,
  colors: PropTypes.array,
  onChange: PropTypes.func,
};

export default TwitterPicker;
