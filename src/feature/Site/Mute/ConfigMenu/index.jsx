import BlockIcon from '@mui/icons-material/Block';

import Mute from './Mute';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: BlockIcon,
  label: info.name,
  View: Mute,
};
