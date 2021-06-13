import contextSheet from '../css/ContextMenu.css';
import { addSetting, getValue, setValue } from './Configure';
import { waitForElement } from './LoadManager';

const USE_CONTEXT_MENU = { key: 'useContextMenu', defaultValue: true };

const eventList = {
  clickOnImage: [],
};

const contextMenuView = <div className="menu" id="context-menu" />;
const contextMenuWrapper = (
  <div className="hidden" id="context-wrapper">
    <style>{contextSheet}</style>
    {contextMenuView}
  </div>
);
let mobile = false;

export async function load() {
  try {
    setupSetting();

    await waitForElement('body');
    initialize();
  } catch (error) {
    console.error(error);
  }
}

function setupSetting() {
  const useContextMenu = (
    <select>
      <option value="false">사용 안 함</option>
      <option value="true">사용</option>
    </select>
  );
  addSetting({
    header: '컨텍스트 메뉴',
    group: [
      {
        title: '컨텍스트 메뉴',
        content: useContextMenu,
      },
    ],
    configHandler: {
      save() {
        setValue(USE_CONTEXT_MENU, useContextMenu.value === 'true');
      },
      load() {
        useContextMenu.value = getValue(USE_CONTEXT_MENU);
      },
    },
  });
}

function initialize() {
  if (!getValue(USE_CONTEXT_MENU)) return;

  document.body.append(contextMenuWrapper);

  if (window.outerWidth <= 768) {
    mobile = true;
    contextMenuWrapper.classList.add('mobile');
  }

  function callEvent(event) {
    if (!contextMenuWrapper.classList.contains('hidden')) {
      hide();
      return;
    }

    if (event.target.closest('.article-body')) {
      if (event.target.closest('img, video:not([controls])')) {
        contextMenuView.dataset.url = `${event.target.src}${
          event.target.tagName === 'VIDEO' ? '.gif' : ''
        }?type=orig`;

        removeMenuAll();
        appendMenu(eventList.clickOnImage);

        show(event);
        event.preventDefault();
      }
    }
  }

  if (mobile) {
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        callEvent(event);
      }
    });
  } else {
    document.addEventListener('contextmenu', callEvent);
  }
  document.addEventListener('click', (event) => {
    if (contextMenuWrapper.classList.contains('hidden')) return;
    if (event.target.closest('#context-menu')) return;

    hide();
    event.preventDefault();
  });
  document.addEventListener('scroll', () => {
    hide();
  });
}

function show(event) {
  contextMenuWrapper.classList.remove('hidden');
  if (!mobile) {
    const x = event.clientX + 2;
    const rect = contextMenuView.getBoundingClientRect();
    let y;
    if (event.clientY + rect.height > window.innerHeight) {
      y = event.clientY - rect.height - 2;
    } else {
      y = event.clientY + 2;
    }
    contextMenuView.setAttribute('style', `left: ${x}px; top: ${y}px`);
  }
}

export function hide() {
  contextMenuWrapper.classList.add('hidden');
}

export function addMenuGroup(event, contextElement) {
  if (!eventList[event]) {
    console.error('[ContextMenu.registContextMenu] 존재하지 않는 이벤트 등록');
    return;
  }

  eventList[event].push(contextElement);
}

function appendMenu(elementArray) {
  let count = 0;

  for (const element of elementArray) {
    if (count > 0) contextMenuView.append(<div className="devider" />);
    contextMenuView.append(element);
    count += 1;
  }
}

function removeMenuAll() {
  while (contextMenuView.childElementCount) {
    contextMenuView.removeChild(contextMenuView.children[0]);
  }
}

export function createMenu(MenuItem) {
  const { text, description, onClick } = MenuItem;
  const menuItem = (
    <a href="#" className="item" title={description || false}>
      {text}
    </a>
  );
  menuItem.addEventListener('click', onClick);
  return menuItem;
}

export function getContextData(name) {
  return contextMenuView.dataset[name];
}
