import { defaultConfig } from './Setting';

export function applyMyImage(editor) {
    if(editor.core.isEmpty()) {
        const img = GM_getValue('myImage', defaultConfig.myImage);
        editor.html.set(img);
        editor.html.insert('<p></p>');
        editor.selection.setAtEnd(editor.$el.get(0));
    }
}

export function applyClipboardUpload(editor) {
    editor.events.on('paste.before', event => {
        const files = event.clipboardData.files;
        if(files.length == 0) return true;

        editor.image.upload(files);

        return false;
    }, true);
}
