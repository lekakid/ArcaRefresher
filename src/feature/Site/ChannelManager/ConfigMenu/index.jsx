import FolderIcon from '@mui/icons-material/Folder';

import View from './View';
import group from '../../group.jsx';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  id: info.id,
  group,
  Icon: FolderIcon,
  label: info.name,
  View,
};
