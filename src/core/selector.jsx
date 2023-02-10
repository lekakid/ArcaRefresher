// CONTAINER LOAD CHECK SELECTOR
export const NAVIGATION_LOADED = '.content-wrapper';
export const CHANNEL_TITLE_LOADED = '.btns-board';
export const BOARD_LOADED = '.article-list + .btns-board';
export const DELETED_ALERT_LOADED = '.board-title + .alert-danger';
export const ARTICLE_LOADED = 'div.included-article-list:not(:first-child)';
export const COMMENT_LOADED = '.article-wrapper ~ div.btns-board';
export const WRITE_LOADED = '.fr-box';
export const AUDIT_LOADED = '.board-audit-list + a.btn';
export const FULL_LOADED = 'footer';

// CONTAINER SELECTOR
export const NAVIGATION_MENU = 'ul.navbar-nav';
export const BOARD_VIEW =
  'div.board-article-list .list-table, div.included-article-list .list-table';
export const BOARD_VIEW_WITHOUT_ARTICLE = 'div.board-article-list .list-table';
export const ARTICLE_VIEW = '.article-wrapper';
export const COMMENT_VIEW = '#comment';
export const COMMENT_INNER_VIEW = '#comment .list-area';
export const WRITE_VIEW = '.article-write';
export const AUDIT_VIEW = '.board-audit-list';
export const TOASTBOX = '#toastbox';

// CONTAINER ITEM SELECTOR
export const BOARD_ARTICLES_WITH_NOTICE = 'a.vrow:not(.notice-unfilter)';
export const BOARD_ARTICLES = 'a.vrow:not(.notice)';
export const ARTICLE_TITLE = '.article-head .title';
export const ARTICLE_AUTHOR = '.article-head .user-info';
export const ARTICLE_IMAGES =
  '.article-body img:not([class$="emoticon"]):not(.twemoji)';
export const ARTICLE_GIFS =
  '.article-body video[data-orig="gif"]:not([class$="emoticon"]):not(.twemoji)';
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
export const COMMENT_SUBTITLE = '#comment .reply-form__user-info';
export const COMMENT_INPUT = '#comment .reply-form-textarea';
export const COMMENT_EMOTICON = '#comment .emoticon';
export const USER_INFO = 'span.user-info';
