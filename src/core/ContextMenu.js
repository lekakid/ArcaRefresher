import contextSheet from '../css/ContextMenu.css';

export default {
    initialize,
    hide,
    addMenuGroup,
    createMenu,
    getContextData,
};

const eventList = {
    clickOnImage: [],
};

const contextMenuView = <div class="menu hidden" id="context-menu" />;

function initialize() {
    // on/off 설정 넣어

    document.head.append(<style>{contextSheet}</style>);
    document.body.append(contextMenuView);

    document.addEventListener('contextmenu', event => {
        if(!contextMenuView.classList.contains('hidden')) {
            hide();
            return;
        }

        if(event.target.closest('.article-body')) {
            if(event.target.closest('img') || (event.target.closest('video') && event.target.dataset.orig)) {
                const url = event.target.parentNode.href;
                contextMenuView.dataset.url = url;

                removeMenuAll();
                appendMenu(eventList.clickOnImage);

                show(event);
                event.preventDefault();
                // return;
            }
        }
    });
    document.addEventListener('click', event => {
        if(contextMenuView.classList.contains('hidden')) return;
        if(event.target.closest('#context-menu')) return;

        hide();
        event.preventDefault();
    });
    document.addEventListener('scroll', () => {
        contextMenuView.classList.add('hidden');
    });
}

function show(event) {
    contextMenuView.classList.remove('hidden');
    contextMenuView.setAttribute('style', `left: ${event.clientX + 2}px; top: ${event.clientY + 2}px`);
}

function hide() {
    contextMenuView.classList.add('hidden');
}

function addMenuGroup(event, contextElement) {
    if(!eventList.hasOwnProperty(event)) {
        console.error('[ContextMenu.registContextMenu] 존재하지 않는 이벤트 등록');
        return;
    }

    eventList[event].push(contextElement);
}

function appendMenu(elementArray) {
    let count = 0;

    for(const element of elementArray) {
        if(count > 0) contextMenuView.append(<div class="devider" />);
        contextMenuView.append(element);
        count += 1;
    }
}

function removeMenuAll() {
    while(contextMenuView.childElementCount) {
        contextMenuView.removeChild(contextMenuView.children[0]);
    }
}

function createMenu(textContent, title) {
    return (<a href="#" class="item" title={(title) || ''}>{textContent}</a>);
}

function getContextData(name) {
    return contextMenuView.dataset[name];
}
