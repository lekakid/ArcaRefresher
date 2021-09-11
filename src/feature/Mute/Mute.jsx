import React from 'react';
import { ArticleMuter, CommentMuter, EmoticonMuter } from './feature';

export default function Mute() {
  return (
    <>
      <ArticleMuter />
      <CommentMuter />
      <EmoticonMuter />
    </>
  );
}
