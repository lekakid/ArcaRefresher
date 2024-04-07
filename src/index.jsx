import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * userscript의 격리된 window.console은 defineProperties로 재정의할 수 없는걸로 보임
 * unsafeWindow의 console을 가져와서 React Error Trace가 대체되지 않는 문제를 해결함
 */
window.console = unsafeWindow.console;

const appContainer = document.createElement('div');
document.body.append(appContainer);
const root = createRoot(appContainer);
root.render(<App />);
