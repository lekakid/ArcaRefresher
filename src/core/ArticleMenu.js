import Parser from './Parser';

export default { appendMenuBtn };

function appendMenuBtn(name, icon, title) {
    const headerMenu = Parser.queryView('article').querySelector('.edit-menu');

    const element = (
        <a href="#" title={title}>
            {icon && <span class={icon} />}
            {` ${name}`}
        </a>
    );

    if(headerMenu.childElementCount) {
        headerMenu.prepend(<span class="sep" />);
    }
    headerMenu.prepend(element);
    return element;
}
