import DefaultConfig from '../core/DefaultConfig';

export default { apply };

function apply(editor) {
    if(editor.core.isEmpty()) {
        const img = GM_getValue('myImage', DefaultConfig.myImage);
        editor.html.set(img);
        editor.html.insert('<p></p>');
        editor.selection.setAtEnd(editor.$el.get(0));
    }
}
