import React from 'react';
import { BoardMuter, ArticleMuter, CommentMuter, ToastMuter } from './Muter';

export default function Mute() {
  return (
    <>
      <BoardMuter />
      <ArticleMuter />
      <CommentMuter />
      <ToastMuter />
    </>
  );
}
