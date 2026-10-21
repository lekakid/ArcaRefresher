import 'core/types';
import ImageDownloader from './ImageDownloader';
import info from '../info';

/** @type {ContextMenuInfo} */
export default {
  key: info.id,
  View: ImageDownloader,
  order: 900,
};
