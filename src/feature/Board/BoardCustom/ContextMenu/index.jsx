import 'core/types';
import BoardCustom from './BoardCustom';
import info from '../info';

/** @type {ContextMenuInfo} */
export default {
  key: info.id,
  View: BoardCustom,
  order: 100,
};
