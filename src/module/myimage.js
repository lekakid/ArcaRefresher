export function apply() {
    if(window.config.myImage == '') return;

    const observer = new MutationObserver(mutations => {
        for(const m of mutations) {
            if(m.target.className == 'note-editable') {
                observer.disconnect();

                const img = <p />;
                img.innerHTML = window.config.myImage;
                unsafeWindow.summernote.summernote('insertNode', img);
                break;
            }
        }
    });
    observer.observe(document, {
        childList: true,
        subtree: true,
    });
}
