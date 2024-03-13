import 'core/types';
import { Bookmark } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: Bookmark,
  label: Info.name,
  View,
};
