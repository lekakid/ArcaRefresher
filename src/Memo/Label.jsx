import React from 'react';

function Label({ memo }) {
  if (!memo) return null;
  return <span>{`-${memo}`}</span>;
}

export default React.memo(Label);
