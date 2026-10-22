import BlockIcon from '@mui/icons-material/Block';

import MediaBlocker from './MediaBlocker';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: BlockIcon,
  label: info.name,
  View: MediaBlocker,
};
