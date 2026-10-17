import SettingsIcon from '@mui/icons-material/Settings';

import View from './View';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: SettingsIcon,
  label: info.name,
  View,
};
