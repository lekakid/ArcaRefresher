export default { addHeaderBtn };

/**
 * 게시물 상단 헤더 메뉴에 버튼을 추가합니다.
 * @param {Object} param                파라미터 오브젝트
 * @param {string} param.text           버튼 텍스트
 * @param {string} param.icon           버튼 좌측에 붙을 아이콘
 * @param {string} [param.description]  버튼에 마우스를 올려두면 표시될 설명
 * @param {Function} param.onClick      버튼을 클릭 시 호출할 콜백 함수
 */
function addHeaderBtn({ text, icon, description, onClick }) {
  const headerMenu = document.querySelector('.edit-menu');
  if (!headerMenu) return;

  const element = (
    <a href="#" title={description}>
      {icon && <span className={icon} />}
      {` ${text}`}
    </a>
  );
  element.addEventListener('click', onClick);

  headerMenu.prepend(
    <>
      {element}
      {headerMenu.childElementCount > 0 && <span className="sep" />}
    </>
  );
}
