import 'core/types';
import { Group } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: Group,
  label: Info.name,
  View,
};
