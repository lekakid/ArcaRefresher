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
        const [, , moduleId] = key.split('/');

        return (
          <ModuleLoadBoundary
            key={key}
            moduleId={moduleId}
            text={`[${moduleId}] 기능에 오류가 발생해 해당 기능이 중단됐습니다.`}
          >
            <Component />
          </ModuleLoadBoundary>
        );
      })}
    </>
  );
}

export default FeatureWrapper;
