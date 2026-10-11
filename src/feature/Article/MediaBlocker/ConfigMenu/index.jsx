import 'core/types';
import BlockIcon from '@mui/icons-material/Block';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: BlockIcon,
  label: Info.name,
  View,
};
