import React, { useCallback, useState } from 'react';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import { Check, Save } from '@mui/icons-material';

const TextEditorRow = React.forwardRef(
  ({ divider, primary, secondary, initialValue, errorText, onSave }, ref) => {
    const [text, setText] = useState(() => initialValue || '');
    const [textChanged, setTextChanged] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = useCallback((e) => {
      setTextChanged(true);
      setText(e.target.value);
      setError(false);
    }, []);

    const handleSave = useCallback(() => {
      try {
        onSave?.(text);
        setTextChanged(false);
      } catch (e) {
        setError(true);
      }
    }, [onSave, text]);

    return (
      <>
        <ListItem ref={ref}>
          <ListItemText primary={primary} secondary={secondary} />
          <ListItemSecondaryAction>
            <IconButton
              color="primary"
              disabled={!textChanged}
              onClick={handleSave}
              size="large"
            >
              {textChanged ? <Save /> : <Check />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem ref={ref} divider={divider}>
          <TextField
            multiline
            fullWidth
            minRows={6}
            error={error}
            value={text}
            onChange={handleChange}
            helperText={error && errorText}
          />
        </ListItem>
      </>
    );
  },
);

TextEditorRow.defaultProps = {
  headerText: '설정 이름',
  initialValue: '',
  errorText: '',
};

export default TextEditorRow;
