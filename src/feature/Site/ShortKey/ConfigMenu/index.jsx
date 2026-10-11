import 'core/types';
import GroupIcon from '@mui/icons-material/Group';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: GroupIcon,
  label: Info.name,
  View,
};
