import { useSelector } from 'react-redux';
import Info from './FeatureInfo';

export default function useOpenState() {
  const { open } = useSelector((state) => state[Info.id]);

  return open;
}
