import { Colorize } from '@material-ui/icons';

import View from './View';
import Info from '../FeatureInfo';

export default {
  key: Info.ID,
  group: 'board',
  Icon: Colorize,
  label: Info.name,
  View,
};
