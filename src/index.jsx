import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/**
 * userscript의 격리된 window.console은 defineProperties로 재정의할 수 없는걸로 보임
 * unsafeWindow의 console을 가져와서 React Error Trace가 대체되지 않는 문제를 해결함
 * useEffect 등에서 에러가 날 때 스크립트 전체가 뻗는게 이상한 것이었던 걸로 확인됨...
 */
window.console = unsafeWindow.console;

const appContainer = document.createElement('div');
document.body.append(appContainer);

ReactDOM.render(<App />, appContainer);
