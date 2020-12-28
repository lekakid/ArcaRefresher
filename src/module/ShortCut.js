import Configure from '../core/Configure';
import Parser from '../core/Parser';

export default { load };

const USE_SHORTCUT = { key: 'useShortcut', defaultValue: false };

function load() {
    try {
        addSetting();

        if(Parser.hasArticle()) {
            apply('article');
        }
        else if(Parser.hasBoard()) {
            apply('board');
        }
    }
    catch(error) {
        console.error(error);
    }
}

function addSetting() {
    const shortCut = (
        <select>
            <option value="false">사용 안 함</option>
            <option value="true">사용</option>
        </select>
    );
    Configure.addSetting({
        category: Configure.categoryKey.UTILITY,
        header: '단축키 사용',
        option: shortCut,
        description: (
            <a href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99" target="_blank" rel="noreferrer">
                단축키 안내 바로가기
            </a>
        ),
        callback: {
            save() {
                Configure.set(USE_SHORTCUT, shortCut.value);
            },
            load() {
                shortCut.value = Configure.get(USE_SHORTCUT);
            },
        },
    });
}

function apply(view) {
    if(!Configure.get(USE_SHORTCUT)) return;

    if(view == 'article') {
        document.addEventListener('keydown', onArticle);
    }
    else if(view == 'board') {
        document.addEventListener('keydown', onBoard);
    }
}

function onArticle(event) {
    // A 목록 바로가기
    // E 추천
    // R 댓글 목록보기
    // W 댓글 입력 포커스

    if(event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

    switch(event.code) {
    case 'KeyA':
        event.preventDefault();
        location.pathname = location.pathname.replace(/\/[0-9]+/, '');
        break;
    case 'KeyE':
        event.preventDefault();
        document.querySelector('#rateUp').click();
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
    // D 이전 페이지
    // F 다음 페이지

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
    case 'KeyD': {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');
        if(active.previousElementSibling) {
            active.previousElementSibling.firstChild.click();
        }
        break;
    }
    case 'KeyF': {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');
        if(active.nextElementSibling) {
            active.nextElementSibling.firstChild.click();
        }
        break;
    }
    default:
        break;
    }
}
