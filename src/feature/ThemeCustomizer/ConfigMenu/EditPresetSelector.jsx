import { Select } from '@material-ui/core';
import React from 'react';

/**
 * EditPresetSelector
 * Material UI Selector와 같습니다.
 * ButtonGroup에 넣어서 사용할 때 ButtonProps 들을 제외해 디버그 메세지를 정리합니다.
 */
export default function EditPresetSelector({
  color,
  disableElevation,
  disableFocusRipple,
  disableRipple,
  children,
  ...SelectProps
}) {
  return React.cloneElement(<Select>{children}</Select>, SelectProps);
}
