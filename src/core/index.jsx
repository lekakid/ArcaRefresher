import { ModuleLoadBoundary } from './ModuleLoadBoundary';

const coreModules = import.meta.glob(['/src/core/*/index.jsx'], {
  eager: true,
  import: 'default',
});
const coreChildren = Object.values(coreModules).map(({ Feature, info }) => ({
  Feature,
  moduleId: info.id,
}));

function CoreWrapper() {
  return (
    <>
      {coreChildren.map(
        ({ Feature, moduleId }) =>
          Feature && (
            <ModuleLoadBoundary
              key={moduleId}
              moduleId={moduleId}
              text={`[${moduleId}] 핵심 기능에 오류가 발생해 해당 기능이 중단됐습니다.`}
            >
              <Feature />
            </ModuleLoadBoundary>
          ),
      )}
    </>
  );
}

export default CoreWrapper;
