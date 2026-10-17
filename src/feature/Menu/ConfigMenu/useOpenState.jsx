import { useSelector } from 'react-redux';
import info from './info';

export default function useOpenState() {
  const { open } = useSelector((state) => state[info.id]);

  return open;
}
