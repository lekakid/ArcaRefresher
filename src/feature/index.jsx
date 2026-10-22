import { ModuleLoadBoundary } from 'core/ModuleLoadBoundary';

const featureModules = import.meta.glob(
  ['/src/feature/*/*/index.jsx', '!/src/feature/_*/**'],
  { eager: true, import: 'default' },
);
const featureChildren = Object.values(featureModules).map(
  ({ Feature, info }) => ({ Feature, moduleId: info.id }),
);

function FeatureWrapper() {
  return (
    <>
      {featureChildren.map(
        ({ Feature, moduleId }) =>
          Feature && (
            <ModuleLoadBoundary
              key={moduleId}
              moduleId={moduleId}
              text={`[${moduleId}] 기능에 오류가 발생해 해당 기능이 중단됐습니다.`}
            >
              <Feature />
            </ModuleLoadBoundary>
          ),
      )}
    </>
  );
}

export default FeatureWrapper;
