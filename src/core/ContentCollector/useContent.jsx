import { useSelector } from 'react-redux';
import info from './info';

/**
 * 게시판 및 게시물 정보를 받아옵니다.
 * @returns {{
 *  user: {
 *    id: string,
 *  }
 *  channel: {
 *    id: string,
 *    name: string,
 *  },
 *  board: {
 *    category: { id: label }
 *  }
 *  article: {
 *    id: string,
 *    category: string,
 *    title: string,
 *    author: string,
 *    date: string,
 *    url: string,
 *  }
 * }}
 */
export default function useContent() {
  const content = useSelector((state) => state[info.id]);
  return content;
}
