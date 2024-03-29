import 'core/types';
import { Block } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: Block,
  label: Info.name,
  View,
};
