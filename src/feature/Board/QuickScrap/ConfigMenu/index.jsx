import 'core/types';
import { Bookmark } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.ID,
  Icon: Bookmark,
  label: Info.name,
  View,
};
