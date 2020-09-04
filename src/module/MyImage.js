import { defaultConfig } from './Setting';

export function apply() {
    const img = GM_getValue('myImage', defaultConfig.myImage);
    if(img == '') return;

    const observer = new MutationObserver(mutations => {
        for(const m of mutations) {
            if(m.target.classList.contains('fr-box')) {
                observer.disconnect();

                const editor = unsafeWindow.FroalaEditor('#content');
                if(editor.core.isEmpty()) {
                    editor.html.set(img);
                    editor.html.insert('<p></p>');
                    editor.selection.setAtEnd(editor.$el.get(0));
                }
                break;
            }
        }
    });
    observer.observe(document.querySelector('.write-body'), {
        childList: true,
        subtree: true,
    });
}
