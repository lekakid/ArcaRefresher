import React from 'react';

function Memo({ memo }) {
  if (!memo) return null;
  return <span>{`-${memo}`}</span>;
}

export default React.memo(Memo);
