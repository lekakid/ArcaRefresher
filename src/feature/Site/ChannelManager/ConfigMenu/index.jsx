import FolderIcon from '@mui/icons-material/Folder';

import ChannelManager from './ChannelManager';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: FolderIcon,
  label: info.name,
  View: ChannelManager,
};
