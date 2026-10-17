import {
  NavigationMuter,
  BoardMuter,
  SidebarMuter,
  ArticleMuter,
  CommentMuter,
  ToastMuter,
  RelayChatMuter,
} from './Muter';

export default function Mute() {
  return (
    <>
      <NavigationMuter />
      <BoardMuter />
      <SidebarMuter />
      <ArticleMuter />
      <CommentMuter />
      <ToastMuter />
      <RelayChatMuter />
    </>
  );
}
