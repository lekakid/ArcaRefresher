import React from 'react';
import {
  NavigationMuter,
  BoardMuter,
  SidebarMuter,
  ArticleMuter,
  CommentMuter,
  ToastMuter,
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
    </>
  );
}
