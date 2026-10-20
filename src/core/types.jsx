// prettier-ignore

/**
 * @typedef {Object} GroupInfo
 * 
 * 설정에서 보일 그룹에 대한 정보를 담고 있습니다.
 * 
 * @property {string} id            그룹 ID
 * @property {Icon}   Icon          그룹 아이콘
 * @property {string} label         그룹의 이름
 * @property {Number} order         그룹 정렬 순서
 */

/**
 * @typedef {Object} FeatureInfo
 *
 * 각 기능 모듈들에 대한 string 정보를 담고 있습니다.
 *
 * @property {string} id            기능의 ID, 폴더 이름과 일치해야합니다.
 * @property {string} name          기능의 이름
 * @property {string} description   기능의 설명
 */

/**
 * @typedef {Object} ConfigMenuInfo
 *
 * 설정 메뉴에 사용되는 오브젝트입니다.  
 * 각 모듈의 ConfigMenu/index.jsx 에서 사용됩니다.
 * 
 * @property {string}   id            기능 info의 id
 * @property {Object}   group         기능 그룹 (group.jsx)
 * @property {Icon}     Icon          설정 메뉴 좌측 목록에서 보일 아이콘
 * @property {string}   label         설정 메뉴 좌측 목록에서 보일 이름
 * @property {string}   View          설정 메뉴에서 보일 컴포넌트
 * @property {Number?}  order         설정 메뉴에서 보일 순서 (생략 시 label 순서 사용)
 */

/**
 * @typedef {Object} ContextMenuInfo
 *
 * 설정 메뉴에 사용되는 오브젝트입니다.  
 * 각 모듈의 ContextMenu/index.jsx 에서 사용됩니다.
 * 
 * @property {string}    key          키 값
 * @property {Component} View         메뉴 아이템 컴포넌트
 * @property {int}       order        정렬 순서
 */
