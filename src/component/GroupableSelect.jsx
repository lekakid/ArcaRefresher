import { Select } from '@material-ui/core';
import React from 'react';

/**
 * GroupableSelect
 * ButtonGroup에 넣어서 사용할 수 있습니다.
 * 존재하지 않는 props 관련 디버그 메세지를 정리합니다.
 */
export default function GroupableSelect({
  color,
  disableElevation,
  disableFocusRipple,
  disableRipple,
  children,
  ...SelectProps
}) {
  return React.cloneElement(<Select>{children}</Select>, SelectProps);
}
