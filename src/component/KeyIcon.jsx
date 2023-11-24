import React from 'react';
import { Paper } from '@mui/material';

export default function KeyIcon({ title }) {
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 24,
        height: 24,
        paddingX: 0.5,
        marginX: 1,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      {title}
    </Paper>
  );
}
