import ArticleMenu from '../core/ArticleMenu';
import Parser from '../core/Parser';

export default { addArticleMenu };

const DefaultPrefix = [
    '웃는', '화난', '불쌍한', '즐거운', '건장한',
    '해탈한', '광기의', '귀여운', '곱슬머리', '개구쟁이',
    '자신있는', '방구석', '노래하는', '책읽는', '구르는',
    '비틀거리는', '힘든', '순수한', '행복한', '불닭먹는',
];
const DefaultSuffix = [
    '미호', '캬루', '둘리', '도바킨', '테레사',
    '윾돌이', '보노보노', '다비', '공룡', '아야',
];

function addArticleMenu() {
    const btn = ArticleMenu.appendMenuBtn('익명화', 'ion-wand', '게시물 작성자와 댓글 작성자를 일시적 익명으로 만듭니다.');
    if(!btn) return;
    btn.addEventListener('click', event => {
        event.preventDefault();

        const userElements = Parser.queryItems('users', 'article');
        const avatarElements = Parser.queryItems('avatars', 'article');

        avatarElements.forEach(e => {
            e.remove();
        });

        const users = new Set();
        userElements.forEach(e => {
            users.add(Parser.parseUserID(e));
        });

        const alterNicks = new Set();
        let overcount = 1;

        while(alterNicks.size < users.size) {
            if(alterNicks.size < DefaultPrefix.length * DefaultSuffix.length) {
                const numPrefix = Math.floor(Math.random() * DefaultPrefix.length);
                const numSuffix = Math.floor(Math.random() * DefaultSuffix.length);
                alterNicks.add(`${DefaultPrefix[numPrefix]} ${DefaultSuffix[numSuffix]}`);
            }
            else {
                alterNicks.add(`비둘기 ${`${overcount++}`.padStart(4, '0')}`);
            }
        }
        const alterTable = {};
        for(let i = 0; i < users.size; i += 1) {
            alterTable[[...users][i]] = [...alterNicks][i];
        }

        userElements.forEach(e => {
            e.textContent = alterTable[Parser.parseUserID(e)];
        });
    });
}
