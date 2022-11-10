import 'core/types';
import { Block } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

/** @type {ConfigMenuInfo} */
export default {
  key: Info.ID,
  group: 'article',
  Icon: Block,
  label: Info.name,
  View,
};
