export default { apply };

function apply(editor) {
    editor.events.on('paste.before', event => {
        const files = event.clipboardData.files;
        if(files.length == 0) return true;

        editor.image.upload(files);

        return false;
    }, true);
}
