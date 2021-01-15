import Parser from './Parser';

export default { addHeaderBtn };

function addHeaderBtn(buttonObject) {
  const { text, icon, description, onClick } = buttonObject;
  const headerMenu = Parser.queryView('article').querySelector('.edit-menu');

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
