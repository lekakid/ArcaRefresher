import PropTypes from 'prop-types';
import { Paper } from '@mui/material';

function KeyIcon({ title }) {
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

KeyIcon.propTypes = {
  title: PropTypes.string,
};

export default KeyIcon;
