import { memo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const BadgeTag = styled('span', {
  name: 'BadgeTag',
})(({ theme }) => ({
  '&:empty': {
    display: 'none',
  },
  marginLeft: '4px',
  padding: '1px 5px',
  borderRadius: '1em',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.85em',
}));

const Text = styled('span', {
  name: 'BadgeText',
})(({ theme }) => ({
  '&:empty': {
    display: 'none',
  },
  '&::before': {
    content: '"["',
  },
  '&::after': {
    content: '"]"',
  },
  padding: '1px 5px',
  color: theme.palette.primary.main,
}));

const colorTable = {
  red: '#ec4545',
  green: '#258d25',
  blue: '#0a96f2',
};

function AuthorTag({ variant = 'badge', color, children }) {
  if (variant === 'badge') {
    return (
      <BadgeTag sx={{ background: colorTable[color] }}>{children}</BadgeTag>
    );
  }

  if (variant === 'text') {
    return <Text sx={{ color: colorTable[color] }}>{children}</Text>;
  }

  return null;
}

AuthorTag.propTypes = {
  variant: PropTypes.oneOf(['badge', 'text']),
  color: PropTypes.string,
  children: PropTypes.node,
};

export default memo(AuthorTag);
