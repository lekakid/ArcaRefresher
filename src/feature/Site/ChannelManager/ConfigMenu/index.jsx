import FolderIcon from '@mui/icons-material/Folder';

import View from './View';
import info from '../info';

/** @type {ConfigMenuInfo} */
export default {
  key: info.id,
  Icon: FolderIcon,
  label: info.name,
  View,
};
