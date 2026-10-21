import { Swatch, EditableInput } from '@uiw/react-color';
import PropTypes from 'prop-types';
import { Box, Paper, Stack } from '@mui/material';

const HEX = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

const DEFAULT_COLORS = [
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
];

function TwitterPicker({ color, colors = DEFAULT_COLORS, onChange }) {
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
            <Stack
              direction="row"
              sx={{ height: '100%', alignItems: 'center' }}
            >
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
                  value={color?.replace('#', '')}
                  onChange={(e) => {
                    const hex = e.target.value.trim().replace(/^#/, '');
                    if (hex === '') onChange('');
                    else if (HEX.test(hex)) onChange(`#${hex}`);
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

TwitterPicker.propTypes = {
  color: PropTypes.string,
  colors: PropTypes.array,
  onChange: PropTypes.func,
};

export default TwitterPicker;
