import { ModuleLoadBoundary } from 'error/ModuleLoadBoundary';

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
      {featureWrapperChildren.map(({ Component, key }) => {
        const [, , name] = key.split('/');

        return (
          <ModuleLoadBoundary key={key} name={name}>
            <Component />
          </ModuleLoadBoundary>
        );
      })}
    </>
  );
}

export default FeatureWrapper;
