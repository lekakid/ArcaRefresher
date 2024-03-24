import ReactDOM from 'react-dom';
import App from './App';

/**
 * userscript의 격리된 window.console은 defineProperties로 재정의할 수 없는걸로 보임
 * unsafeWindow의 console을 가져와서 React Error Trace가 대체되지 않는 문제를 해결함
 * useEffect 등에서 에러가 날 때 스크립트 전체가 뻗는게 이상한 것이었던 걸로 확인됨...
 */
window.console = unsafeWindow.console;

const appendAppContainer = () => {
  const appContainer = document.createElement('div');
  document.body.append(appContainer);

  ReactDOM.render(<App />, appContainer);
};

if (!document.body) {
  // @run-at document-start은 document.body가 없을 때 실행될 수 있음
  // MutationObserver로 body가 추가되는 것을 감지하여 appendAppContainer를 실행
  const mutationObserver = new MutationObserver((mutations, obs) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName.toLocaleUpperCase() === 'BODY') {
          appendAppContainer();
          obs.disconnect();
        }
      });
    });
  });
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
} else {
  appendAppContainer();
}
