export function apply(view) {
    if(!window.config.useShortcut) return;

    if(view == 'article') {
        document.addEventListener('keydown', onArticle);
    }
    else if(view == 'board') {
        document.addEventListener('keydown', onBoard);
    }
}

function onArticle(event) {
    // A 목록 바로가기
    // R 댓글 목록보기
    // W 댓글 입력 포커스

    if(event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

    switch(event.code) {
    case 'KeyA':
        event.preventDefault();
        location.pathname = location.pathname.replace(/\/[0-9]+/, '');
        break;
    case 'KeyR': {
        event.preventDefault();
        const commentForm = document.querySelector('.article-comment');
        window.scrollTo({ top: commentForm.offsetTop - 50, behavior: 'smooth' });
        break;
    }
    case 'KeyW': {
        event.preventDefault();
        const inputForm = document.querySelector('.article-comment .subtitle');
        const input = document.querySelector('.article-comment .input textarea');
        const top = window.pageYOffset + inputForm.getBoundingClientRect().top;
        window.scrollTo({ top: top - 50, behavior: 'smooth' });
        input.focus({ preventScroll: true });
        break;
    }
    default:
        break;
    }
}

function onBoard(event) {
    // W 게시물 쓰기
    // E 헤드라인

    if(event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

    switch(event.code) {
    case 'KeyW': {
        event.preventDefault();
        const path = location.pathname.split('/');
        let writePath = '';
        if(path[path.length - 1] == '') {
            path[path.length - 1] = 'write';
        }
        else {
            path.push('write');
        }
        writePath = path.join('/');
        location.pathname = writePath;
        break;
    }
    case 'KeyE': {
        event.preventDefault();
        if(location.search.indexOf('mode=best') > -1) {
            location.search = '';
        }
        else {
            location.search = '?mode=best';
        }
        break;
    }
    default:
        break;
    }
}
