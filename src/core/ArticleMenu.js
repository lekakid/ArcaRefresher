import Parser from './Parser';

export default { appendMenuBtn };

function appendMenuBtn(name, icon, title, event) {
    const headerMenu = Parser.queryView('article').querySelector('.edit-menu');
    if(!headerMenu) return;

    const element = (
        <a href="#" title={title}>
            {icon && <span class={icon} />}
            {` ${name}`}
        </a>
    );

    element.addEventListener('click', event);

    if(headerMenu.childElementCount) {
        headerMenu.prepend(<span class="sep" />);
    }
    headerMenu.prepend(element);
    return element;
}
