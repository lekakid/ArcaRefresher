export function apply() {
    const observer = new MutationObserver((mutations) => {
        for(const m of mutations) {
            if(m.target.classList.contains('fr-box')) {
                observer.disconnect();

                const editor = unsafeWindow.FroalaEditor('#content');
                editor.events.on('paste.before', onPasteImage, true);

                break;
            }
        }
    });
    observer.observe(document.querySelector('.write-body'), {
        childList: true,
        subtree: true,
    });
}

function onPasteImage(event) {
    const files = event.clipboardData.files;

    if(files.length == 0) return true;

    const editor = unsafeWindow.FroalaEditor('#content');
    editor.image.upload(files);

    return false;
}
