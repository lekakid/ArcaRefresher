import { Folder } from '@mui/icons-material';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.id,
  Icon: Folder,
  label: Info.name,
  View,
};
