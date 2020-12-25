import Parser from './Parser';

export default { appendMenuBtn };

function appendMenuBtn(name, icon, title) {
    const headerMenu = Parser.queryView('article').querySelector('.edit-menu');
    if(!headerMenu) return;

    const element = (
        <>
            <a href="#" title={title}>
                {icon && <span class={icon} />}
                {` ${name}`}
            </a>
            {headerMenu.childElementCount && <span class="sep" />}
        </>
    );

    headerMenu.prepend(element);
    return element;
}
