import { styled } from '@mui/styles';
import React from 'react';

const Badge = styled('span')(({ theme }) => ({
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

const Text = styled('span')(({ theme }) => ({
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

function AuthorTag({ variant, className, children }) {
  if (variant === 'badge') {
    return <Badge className={className}>{children}</Badge>;
  }

  if (variant === 'text') {
    return <Text className={className}>{children}</Text>;
  }

  return null;
}

AuthorTag.defaultProps = {
  variant: 'badge',
};

export default React.memo(AuthorTag);
