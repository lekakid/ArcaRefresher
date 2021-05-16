import transitionSheet from '../css/Transition.css';
import { waitForElement } from './LoadManager';

export async function initilaize() {
  await waitForElement('head');
  document.head.append(<style>{transitionSheet}</style>);
}

export function useFade(DOMElement, defaultValue) {
  let visible = defaultValue || false;

  DOMElement.addEventListener('animationend', (e) => {
    DOMElement.classList.remove('fade-in');
    DOMElement.classList.remove('fade-out');

    if (!visible) {
      DOMElement.classList.add('hidden');
    }
  });
  if (!visible) {
    DOMElement.classList.add('hidden');
  }

  return () => {
    DOMElement.classList.remove('hidden');

    if (visible) {
      DOMElement.classList.add('fade-out');
      visible = false;
    } else {
      DOMElement.classList.add('fade-in');
      visible = true;
    }
    return visible;
  };
}
