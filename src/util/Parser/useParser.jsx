import { useSelector } from 'react-redux';
import { MODULE_ID } from './ModuleInfo';

export default function useParser() {
  return useSelector((state) => state[MODULE_ID]);
}
