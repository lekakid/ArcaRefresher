import React from 'react';
import {
  BoardMuter,
  SidebarMuter,
  ArticleMuter,
  CommentMuter,
  ToastMuter,
} from './Muter';

export default function Mute() {
  return (
    <>
      <BoardMuter />
      <SidebarMuter />
      <ArticleMuter />
      <CommentMuter />
      <ToastMuter />
    </>
  );
}
