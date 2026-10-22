import MouseIcon from '@mui/icons-material/Mouse';

import ContextMenu from './ContextMenu';
import group from '../../group.jsx';
import info from '../info';

export default {
  id: info.id,
  group,
  Icon: MouseIcon,
  label: info.name,
  View: ContextMenu,
};
