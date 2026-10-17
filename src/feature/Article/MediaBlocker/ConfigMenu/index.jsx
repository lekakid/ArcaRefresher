import 'core/types';
import BlockIcon from '@mui/icons-material/Block';

import View from './View';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  key: info.id,
  Icon: BlockIcon,
  label: info.name,
  View,
};
