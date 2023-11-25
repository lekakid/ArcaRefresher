import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/**
 * Tampermonkey 환경 console은 구체적인 이유는 모르겠지만 defineProperties로 console을 재정의할 수 없음
 * unsafeWindow의 console을 가져와서 React Error Trace가 대체되지 않는 문제를 해결함
 */
if (process.env.NODE_ENV !== 'production')
  window.console = unsafeWindow.console;

const appContainer = document.createElement('div');
document.body.append(appContainer);

ReactDOM.render(<App />, appContainer);
