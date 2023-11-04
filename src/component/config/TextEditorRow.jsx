import React, { useCallback, useState } from 'react';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';

const TextEditorRow = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function TextEditorRow(
    { divider, headerText, initialValue, errorText, onSave },
    ref,
  ) {
    const [text, setText] = useState(() => initialValue);
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
          <ListItemText>{headerText}</ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              color="primary"
              disabled={!textChanged}
              onClick={handleSave}
            >
              {textChanged ? <Save /> : <Check />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem ref={ref} divider={divider}>
          <TextField
            variant="outlined"
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
