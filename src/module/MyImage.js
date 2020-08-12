export function apply() {
    if(window.config.myImage == '') return;

    const observer = new MutationObserver(mutations => {
        for(const m of mutations) {
            if(m.target.classList.contains('fr-box')) {
                observer.disconnect();

                const img = window.config.myImage;

                const editor = unsafeWindow.FroalaEditor('#content');
                editor.html.insert(img);
                break;
            }
        }
    });
    observer.observe(document.querySelector('.write-body'), {
        childList: true,
        subtree: true,
    });
}
