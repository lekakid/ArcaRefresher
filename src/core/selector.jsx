// 게시판 등 컨테이너 요소의 내용물이 100% 로드 됐는지 체크하는 용도
export const NAVIGATION_LOADED = '.content-wrapper';
export const CHANNEL_TITLE_LOADED = '.btns-board';
export const BOARD_LOADED = '.article-list + .btns-board';
export const DELETED_ALERT_LOADED = '.board-title + .alert-danger';
export const ARTICLE_LOADED = 'div.included-article-list:not(:first-child)';
export const COMMENT_LOADED = '.article-wrapper ~ div.btns-board';
export const WRITE_LOADED = '.fr-box';
export const AUDIT_LOADED = '.board-audit-list + a.btn';
export const FULL_LOADED = 'footer';

// 게시판 등 컨테이너 자체
export const NAVIGATION_MENU = 'ul.navbar-nav';
export const BOARD_IN_ARTICLE = 'div.included-article-list .list-table';
export const BOARD = 'div.article-list .list-table';
export const ARTICLE = '.article-wrapper';
export const COMMENT = '#comment';
export const COMMENT_INNER = '#comment .list-area';
export const WRITE = '.article-write';
export const AUDIT = '.board-audit-list';
export const TOASTBOX = '#toastbox';

// 컨테이너 내에 있는 아이템
export const BOARD_NOTICES = '.vrow.notice:not(.notice-unfilter)';
export const BOARD_ITEMS = '.vrow.column:not(.notice):not(.head), .vrow.hybrid';
export const BOARD_ITEMS_WITH_NOTICE =
  '.vrow.column:not(.notice-unfilter):not(.head), .vrow.hybrid';
export const BOARD_SITE_NOTICES = '.vrow.notice-service';
export const ARTICLE_TITLE = '.article-head .title';
export const ARTICLE_AUTHOR =
  '.article-head .user-info, .article-head .member-info';
export const ARTICLE_IMAGES =
  '.article-content img:not([class$="emoticon"]):not(.twemoji)';
export const ARTICLE_GIFS =
  '.article-content video[data-orig="gif"]:not([class$="emoticon"])';
export const ARTICLE_MEDIA =
  '.article-content img:not(.twemoji), .article-content video';
export const ARTICLE_EMOTICON = '.article-body *[class$="emoticon"]';
export const ARTICLE_URL = '.article-body .article-link a';
export const ARTICLE_BODY = '.article-body';
export const ARTICLE_CONTENT = '.article-content';
export const ARTICLE_HEADER_MENU = '.edit-menu';
export const ARTICLE_MENU = '.article-menu';
export const ARTICLE_USER_INFO = '.article-wrapper .user-info';
export const COMMENT_WRAPPERS = '#comment .comment-wrapper';
export const COMMENT_ITEMS = '#comment .comment-item';
export const COMMENT_TITLE = '#comment .title';
export const COMMENT_USER_INFO = '#comment .user-info';
export const COMMENT_SUBTITLE = '#comment .reply-form__user-info';
export const COMMENT_INPUT = '#comment .reply-form-textarea';
export const COMMENT_EMOTICON = '#comment .emoticon';
export const USER_INFO = 'span.user-info';
