import InfoIcon from '@mui/icons-material/Info';

import VersionInfo from './VersionInfo';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: InfoIcon,
  label: info.name,
  View: VersionInfo,
};
