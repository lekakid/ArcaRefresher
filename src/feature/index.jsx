import React from 'react';

const context = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/Feature$/,
);

function FeatureWrapper() {
  return (
    <>
      {context
        .keys()
        .map((path) => ({ Component: context(path).default, key: path }))
        .map(({ Component, key }) => (
          <Component key={key} />
        ))}
    </>
  );
}

export default FeatureWrapper;
