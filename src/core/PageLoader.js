export default { load };

async function load() {
    const path = location.pathname;

    if(path.indexOf('/b/') > -1) {
        await waitForElement('footer');
    }
    else {
        await waitForElement('.content-wrapper');
    }
}

async function waitForElement(selector) {
    let targetElement = document.querySelector(selector);

    if(targetElement) return Promise.resolve(targetElement);

    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            targetElement = document.querySelector(selector);

            if(targetElement) {
                observer.disconnect();
                resolve(targetElement);
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    });
}
