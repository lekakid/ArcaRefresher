import { ModuleLoadBoundary } from 'error/ModuleLoadBoundary';

const featureModules = import.meta.glob(
  ['/src/feature/*/*/Feature.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);

const featureChildren = Object.entries(featureModules).map(
  ([path, Component]) => ({ Component, moduleId: path.split('/')[4] }),
);

function FeatureWrapper() {
  return (
    <>
      {featureChildren.map(({ Component, moduleId }) => (
        <ModuleLoadBoundary
          key={moduleId}
          moduleId={moduleId}
          text={`[${moduleId}] 기능에 오류가 발생해 해당 기능이 중단됐습니다.`}
        >
          <Component />
        </ModuleLoadBoundary>
      ))}
    </>
  );
}

export default FeatureWrapper;
