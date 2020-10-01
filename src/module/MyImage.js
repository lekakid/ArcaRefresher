import { defaultConfig } from './Setting';

export default { apply };

function apply(editor) {
    if(editor.core.isEmpty()) {
        const img = GM_getValue('myImage', defaultConfig.myImage);
        editor.html.set(img);
        editor.html.insert('<p></p>');
        editor.selection.setAtEnd(editor.$el.get(0));
    }
}
