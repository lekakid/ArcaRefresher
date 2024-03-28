import { forwardRef, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { IconButton, ListItemText, TextField } from '@mui/material';
import { Check, Save } from '@mui/icons-material';
import BaseRow from './BaseRow';

const TextFieldRow = forwardRef(
  (
    {
      divider,
      nested,
      primary,
      secondary,
      multiline,
      manualSave,
      value,
      errorText,
      action,
      saveFormat,
      onChange,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const [baseValue, setBaseValue] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
      setBaseValue(value);
    }, [value]);

    const handleSave = useCallback(() => {
      try {
        const formatted = saveFormat?.(baseValue) || baseValue;
        dispatch(action(formatted));
      } catch (error) {
        setShowError(true);
      }
    }, [dispatch, action, saveFormat, baseValue]);

    const handleChange = useCallback(
      (e) => {
        setShowError(false);
        setBaseValue(e.target.value);
        if (!manualSave) dispatch(action(e.target.value));
      },
      [dispatch, action, manualSave],
    );

    return (
      <BaseRow
        ref={ref}
        divider={divider}
        nested={nested}
        column="always"
        header={
          <>
            <ListItemText primary={primary} secondary={secondary} />
            {manualSave && (
              <IconButton disabled={baseValue === value} onClick={handleSave}>
                {baseValue !== value ? <Save /> : <Check />}
              </IconButton>
            )}
          </>
        }
      >
        <TextField
          fullWidth
          multiline={multiline}
          minRows={multiline ? 6 : undefined}
          maxRows={multiline ? 6 : undefined}
          error={showError}
          value={baseValue}
          helperText={showError ? errorText : ''}
          onChange={onChange || handleChange}
        />
      </BaseRow>
    );
  },
);

const RowPropTypes = {
  divider: PropTypes.bool,
  nested: PropTypes.bool,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  multiline: PropTypes.bool,
  manualSave: PropTypes.bool,
  value: PropTypes.string,
  errorText: PropTypes.string,
  action: PropTypes.func,
  saveFormat: PropTypes.func,
  onChange: PropTypes.func,
};

TextFieldRow.propTypes = RowPropTypes;
export default TextFieldRow;
