const featureContext = require.context(
  'feature/',
  true,
  /^feature\/(?!_).+\/Feature$/,
);
const featureWrapperChildren = featureContext
  .keys()
  .map((path) => ({ Component: featureContext(path).default, key: path }));

function FeatureWrapper() {
  return (
    <>
      {featureWrapperChildren.map(({ Component, key }) => (
        <Component key={key} />
      ))}
    </>
  );
}

export default FeatureWrapper;
