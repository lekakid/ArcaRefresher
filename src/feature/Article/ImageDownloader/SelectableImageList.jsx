import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { CheckCircle, CheckCircleOutline } from '@mui/icons-material';

function SelectableImageList({ imgList, selection, onChange }) {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const handleSelect = useCallback(
    (index) => () => {
      const next = selection.includes(index)
        ? selection.filter((s) => s !== index)
        : [...selection, index];
      onChange(next);
    },
    [onChange, selection],
  );

  if (imgList.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '200px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography>이 게시물에는 이미지가 없습니다.</Typography>
      </Box>
    );
  }
  return (
    <ImageList cols={mobile ? 3 : 6} rowHeight={mobile ? 100 : 180}>
      {imgList.map((img, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ImageListItem key={`${img}_${index}`} onClick={handleSelect(index)}>
          <img
            style={{ overflow: 'hidden' }}
            src={img}
            alt={img}
            loading="lazy"
          />
          <ImageListItemBar
            sx={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
            }}
            position="top"
            actionPosition="left"
            actionIcon={
              <Checkbox
                size="small"
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: 'white',
                  },
                }}
                icon={<CheckCircleOutline />}
                checkedIcon={<CheckCircle />}
                checked={selection.includes(index)}
                onClick={handleSelect(index)}
              />
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

SelectableImageList.propTypes = {
  imgList: PropTypes.array.isRequired,
  selection: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectableImageList;
